"""
message_analysis.py
Analyzes free-text messages (SMS / WhatsApp / chat) in English, Hindi and
Hinglish for social-engineering, urgency, financial-fraud and brand
impersonation indicators. Also extracts and delegates any embedded links to
url_analysis.py.
"""
import re

from .keywords import (
    URGENCY_PATTERNS, THREAT_PATTERNS, REWARD_PATTERNS,
    AUTHORITY_IMPERSONATION, FINANCIAL_FRAUD_TERMS,
    ACTION_REQUEST_PATTERNS, GRAMMAR_RED_FLAGS,
)
from .url_analysis import analyze_url

URL_REGEX = re.compile(
    r"(?:(?:https?://|www\.)[^\s]+)|(?:\b[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(?:/[^\s]*)?)",
    re.IGNORECASE,
)


def _find_matches(text: str, patterns: list) -> list:
    lower = text.lower()
    return [p for p in patterns if p in lower]


def extract_urls(text: str) -> list:
    candidates = URL_REGEX.findall(text)
    # filter out obvious non-URLs like "e.g." or version numbers
    cleaned = []
    for c in candidates:
        c = c.strip(").,!?\"'")
        if "." in c and len(c) > 4:
            cleaned.append(c)
    return list(dict.fromkeys(cleaned))  # de-dupe, preserve order


def analyze_message(text: str, language_hint: str = "auto") -> dict:
    if not text or not text.strip():
        return {
            "valid": False,
            "error": "Message text is empty.",
            "indicators": [],
            "findings": {},
        }

    indicators = []
    findings = {}

    urgency_hits = _find_matches(text, URGENCY_PATTERNS)
    threat_hits = _find_matches(text, THREAT_PATTERNS)
    reward_hits = _find_matches(text, REWARD_PATTERNS)
    authority_hits = _find_matches(text, AUTHORITY_IMPERSONATION)
    financial_hits = _find_matches(text, FINANCIAL_FRAUD_TERMS)
    action_hits = _find_matches(text, ACTION_REQUEST_PATTERNS)
    grammar_hits = _find_matches(text, GRAMMAR_RED_FLAGS)

    if urgency_hits:
        indicators.append(("Urgency-based language detected", "high"))
    if threat_hits:
        indicators.append(("Threat of account suspension/legal action detected", "critical"))
    if reward_hits:
        indicators.append(("Reward / prize / lottery bait language detected", "high"))
    if authority_hits:
        indicators.append((f"Mentions authority/brand: {', '.join(sorted(set(authority_hits)))}", "medium"))
    if financial_hits:
        indicators.append((f"Requests financial/sensitive info: {', '.join(sorted(set(financial_hits)))}", "critical"))
    if action_hits:
        indicators.append(("Requests immediate action (click/verify/share)", "high"))
    if grammar_hits:
        indicators.append(("Generic greeting / grammar pattern typical of mass scam messages", "low"))

    # Excessive capitalization / exclamation
    letters = [c for c in text if c.isalpha()]
    if letters and sum(1 for c in letters if c.isupper()) / len(letters) > 0.4 and len(letters) > 15:
        indicators.append(("Excessive capitalization (shouting tone)", "low"))
    if text.count("!") >= 3:
        indicators.append(("Excessive exclamation marks", "low"))

    # Embedded links
    urls = extract_urls(text)
    url_results = []
    for u in urls:
        result = analyze_url(u)
        url_results.append({"url": u, **result})
        if result.get("valid"):
            for label, sev in result["indicators"]:
                indicators.append((f"[Link: {u}] {label}", sev))
            if result["findings"].get("impersonated_brand"):
                indicators.append((f"Link impersonates trusted brand '{result['findings']['impersonated_brand']}'", "critical"))
    if urls:
        indicators.append((f"Message contains {len(urls)} embedded link(s)", "low"))

    findings["urgency_terms"] = urgency_hits
    findings["threat_terms"] = threat_hits
    findings["reward_terms"] = reward_hits
    findings["authority_terms"] = authority_hits
    findings["financial_terms"] = financial_hits
    findings["action_terms"] = action_hits
    findings["urls"] = url_results
    findings["language_detected"] = _detect_language(text)

    return {
        "valid": True,
        "error": None,
        "indicators": indicators,
        "findings": findings,
    }


def _detect_language(text: str) -> str:
    """Very lightweight heuristic language detector for the demo."""
    devanagari = re.search(r"[\u0900-\u097F]", text)
    if devanagari:
        return "hindi"
    hinglish_markers = ["bhai", "kar", "hai", "kijiye", "karein", "warna", "aapka", "jaldi"]
    lower = text.lower()
    if any(m in lower for m in hinglish_markers):
        return "hinglish"
    return "english"
