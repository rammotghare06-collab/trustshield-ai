"""
recommendation_engine.py
Generates actionable, plain-language recommendations based on risk level
and detected indicator categories.
"""

BASE_RECOMMENDATIONS = {
    "TRUSTED": "No major threat indicators found. Still avoid sharing OTP, PIN or passwords with anyone who contacts you first.",
    "CAUTION": "Proceed carefully. Double-check the sender or website through an official channel before taking any action.",
    "SUSPICIOUS": "Treat this as unsafe. Do not click links or reply with personal/financial information until you verify it independently.",
    "DANGEROUS": "Do not click the link. Do not share OTP, password, PIN, CVV or banking information. Report and delete this message.",
}


def generate_recommendation(risk_level: str, findings: dict) -> dict:
    steps = []
    base = BASE_RECOMMENDATIONS.get(risk_level, BASE_RECOMMENDATIONS["CAUTION"])

    financial_terms = findings.get("financial_terms") or []
    action_terms = findings.get("action_terms") or []
    urls = findings.get("urls") or []
    impersonated = findings.get("impersonated_brand")

    if financial_terms:
        steps.append("Never share OTP, PIN, CVV, UPI PIN or net-banking credentials over SMS, WhatsApp, email or phone.")
    if action_terms:
        steps.append("Do not click embedded links or call numbers provided in the message. Go directly to the official app or website instead.")
    if urls:
        steps.append("Verify the destination domain independently before entering any credentials.")
    if impersonated:
        steps.append(f"Confirm any claim from '{impersonated}' by contacting them through their official app, website, or verified helpline — not the contact info in this message.")

    if risk_level in ("SUSPICIOUS", "DANGEROUS"):
        steps.append("Report the message/number to your bank's fraud helpline or cybercrime.gov.in (India).")
        steps.append("Block the sender to prevent further contact.")

    if not steps:
        steps.append("No specific action required, but stay alert for follow-up messages requesting sensitive information.")

    return {"summary": base, "steps": steps}
