"""
risk_scoring.py
Converts a list of (indicator_label, severity) tuples produced by the other
analysis modules into a single Digital Trust Score (0-100), a risk level,
and a confidence percentage.
"""

SEVERITY_WEIGHTS = {
    "critical": 28,
    "high": 16,
    "medium": 9,
    "low": 4,
}

RISK_BANDS = [
    (90, 100, "TRUSTED", "green"),
    (60, 89, "CAUTION", "yellow"),
    (30, 59, "SUSPICIOUS", "orange"),
    (0, 29, "DANGEROUS", "red"),
]


def score_from_indicators(indicators: list) -> dict:
    """
    indicators: list of (label:str, severity:str)
    Returns dict with score, risk_level, color, confidence, indicator_count
    """
    deduction = 0
    for _, severity in indicators:
        deduction += SEVERITY_WEIGHTS.get(severity, 5)

    score = max(0, min(100, 100 - deduction))

    risk_level, color = "TRUSTED", "green"
    for low, high, label, band_color in RISK_BANDS:
        if low <= score <= high:
            risk_level, color = label, band_color
            break

    # Confidence grows with number of corroborating indicators, capped at 97%
    n = len(indicators)
    if n == 0:
        confidence = 55  # low evidence either way -> moderate confidence it's clean
    else:
        confidence = min(97, 60 + n * 6)

    critical_count = sum(1 for _, s in indicators if s == "critical")
    high_count = sum(1 for _, s in indicators if s == "high")

    return {
        "score": score,
        "risk_level": risk_level,
        "color": color,
        "confidence": confidence,
        "indicator_count": n,
        "critical_count": critical_count,
        "high_count": high_count,
    }


def classify_message(score: int) -> str:
    """Maps a numeric score to the 4-tier message classification used by the UI."""
    if score >= 90:
        return "REAL / SAFE"
    if score >= 60:
        return "SUSPICIOUS"
    if score >= 30:
        return "POSSIBLE SCAM"
    return "PHISHING / FRAUD"
