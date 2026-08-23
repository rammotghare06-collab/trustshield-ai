"""
trust_score.py
Top-level orchestration: runs the correct analyzer for a given scan type,
converts indicators into a trust score, and packages everything (including
the recommendation and a "Digital Trust Passport") into one response object
consumed by the API layer and the frontend.
"""
from .message_analysis import analyze_message
from .url_analysis import analyze_url
from .qr_analysis import analyze_qr
from .email_analysis import analyze_email
from .risk_scoring import score_from_indicators, classify_message
from .recommendation_engine import generate_recommendation

ANALYZERS = {
    "message": lambda payload: analyze_message(payload.get("text", "")),
    "url": lambda payload: analyze_url(payload.get("url", "")),
    "qr": lambda payload: analyze_qr(payload.get("image_bytes", b"")),
    "email": lambda payload: analyze_email(
        payload.get("sender", ""), payload.get("subject", ""), payload.get("body", "")
    ),
}


def run_scan(scan_type: str, payload: dict) -> dict:
    if scan_type not in ANALYZERS:
        raise ValueError(f"Unsupported scan type: {scan_type}")

    analysis = ANALYZERS[scan_type](payload)

    if not analysis.get("valid"):
        return {
            "valid": False,
            "error": analysis.get("error", "Unable to analyze input."),
            "scan_type": scan_type,
        }

    indicators = analysis["indicators"]
    findings = analysis["findings"]

    scoring = score_from_indicators(indicators)
    classification = classify_message(scoring["score"])
    recommendation = generate_recommendation(scoring["risk_level"], findings)
    passport = build_trust_passport(scan_type, scoring, findings, indicators)

    return {
        "valid": True,
        "scan_type": scan_type,
        "score": scoring["score"],
        "risk_level": scoring["risk_level"],
        "color": scoring["color"],
        "confidence": scoring["confidence"],
        "classification": classification,
        "indicator_count": scoring["indicator_count"],
        "indicators": [{"label": label, "severity": sev} for label, sev in indicators],
        "findings": findings,
        "recommendation": recommendation,
        "trust_passport": passport,
    }


def build_trust_passport(scan_type: str, scoring: dict, findings: dict, indicators: list) -> dict:
    """Builds the visually-branded 'Digital Trust Passport' summary object.

    Scans the full (possibly nested) indicator list for keyword signals so
    the passport is accurate whether the scan came from a raw URL or from a
    message/email that merely contains one.
    """
    score = scoring["score"]
    labels = " | ".join(label.lower() for label, _ in indicators)

    def status(ok: bool, good_text: str, bad_text: str) -> dict:
        return {"ok": ok, "text": good_text if ok else bad_text}

    identity = status(
        "impersonat" not in labels and "typosquat" not in labels,
        "Domain / sender identity looks consistent",
        "Identity could not be fully verified — impersonation risk found",
    )

    security = status(
        "no https" not in labels,
        "Secure connection (HTTPS) as expected",
        "No HTTPS encryption detected",
    )

    reputation = status(
        "impersonat" not in labels and "typosquat" not in labels and "uncommon/high-risk top-level domain" not in labels,
        "Low reputation-risk indicators",
        "Reputation concerns detected (brand impersonation / risky domain)",
    )

    content = status(
        scoring["critical_count"] == 0,
        "No major phishing indicators",
        f"{scoring['critical_count']} critical indicator(s) found",
    )

    behavior = status(
        "shorten" not in labels and "ip address" not in labels and "redirect" not in labels,
        "No suspicious redirects/shorteners detected",
        "Suspicious link behavior detected (shortener, redirect, or raw IP)",
    )

    risk_summary = "LOW" if score >= 90 else "MODERATE" if score >= 60 else "HIGH" if score >= 30 else "CRITICAL"

    return {
        "trust_score": score,
        "identity": identity,
        "security": security,
        "reputation": reputation,
        "content": content,
        "behavior": behavior,
        "risk_summary": risk_summary,
    }
