"""
email_analysis.py
Analyzes email content (sender, subject, body) reusing the message-analysis
engine for language/link indicators, plus email-specific sender checks.
"""
import re

from .message_analysis import analyze_message
from .keywords import TRUSTED_BRAND_KEYWORDS, OFFICIAL_DOMAINS

FREE_MAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com"]


def analyze_email(sender: str, subject: str, body: str) -> dict:
    indicators = []
    findings = {}

    combined_text = f"{subject}\n{body}"
    base = analyze_message(combined_text)
    if not base["valid"]:
        return base

    indicators.extend(base["indicators"])
    findings.update(base["findings"])

    sender = (sender or "").strip()
    findings["sender"] = sender

    if sender:
        match = re.search(r"@([\w.\-]+)", sender)
        sender_domain = match.group(1).lower() if match else ""
        findings["sender_domain"] = sender_domain

        # Check for brand name in display-name/local-part but free-mail domain
        display_lower = sender.lower()
        for brand in TRUSTED_BRAND_KEYWORDS:
            if brand in display_lower:
                official = OFFICIAL_DOMAINS.get(brand, "")
                if sender_domain and official and not sender_domain.endswith(official):
                    indicators.append(
                        (f"Sender claims to be '{brand}' but email domain is '{sender_domain}', not '{official}'", "critical")
                    )
                break

        if sender_domain in FREE_MAIL_DOMAINS and any(
            b in subject.lower() or b in body.lower() for b in TRUSTED_BRAND_KEYWORDS
        ):
            indicators.append(("Sent from a free/personal email provider while impersonating an organization", "high"))
    else:
        indicators.append(("No sender address provided", "low"))

    return {
        "valid": True,
        "error": None,
        "indicators": indicators,
        "findings": findings,
    }
