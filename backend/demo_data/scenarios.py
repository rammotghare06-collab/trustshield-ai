"""
scenarios.py
Local demo dataset used by the "Live Threat Simulator" so the hackathon
demo works fully offline. These are simulated examples, clearly labelled
as such — never presented as real-time threat intelligence.
"""

SCENARIOS = [
    {
        "id": "fake-bank",
        "title": "Fake Bank Message",
        "category": "message",
        "payload": {
            "text": "Dear Customer, your SBI account will be BLOCKED today due to KYC expiry. "
                    "Update immediately: http://sbi-kyc-verify.xyz/update or your account will be suspended.",
        },
        "expected_label": "PHISHING / FRAUD",
    },
    {
        "id": "fake-kyc",
        "title": "Fake KYC Message (Hinglish)",
        "category": "message",
        "payload": {
            "text": "Bhai jaldi se ye link open kar aur KYC update kar warna account band ho jayega: "
                    "http://kyc-update-now.top/verify",
        },
        "expected_label": "PHISHING / FRAUD",
    },
    {
        "id": "fake-delivery",
        "title": "Fake Delivery Message",
        "category": "message",
        "payload": {
            "text": "Your parcel is held at customs. Pay Rs 49 customs duty immediately to release: "
                    "http://courier-track.info/pay - action required within 24 hours.",
        },
        "expected_label": "PHISHING / FRAUD",
    },
    {
        "id": "fake-lottery",
        "title": "Fake Lottery Message",
        "category": "message",
        "payload": {
            "text": "CONGRATULATIONS! You have won Rs 25,00,000 in the KBC lucky draw. "
                    "Claim your prize now by sharing your bank account, IFSC and OTP.",
        },
        "expected_label": "PHISHING / FRAUD",
    },
    {
        "id": "fake-job",
        "title": "Fake Job Offer",
        "category": "message",
        "payload": {
            "text": "Congratulations! You are selected for a work from home job with salary Rs 45000/month. "
                    "Pay Rs 999 registration fee to confirm: http://job-offer-apply.club/register",
        },
        "expected_label": "POSSIBLE SCAM",
    },
    {
        "id": "fake-payment-link",
        "title": "Fake Payment Link",
        "category": "url",
        "payload": {"url": "http://paytm-cashback-claim.xyz/offer?redirect=1"},
        "expected_label": "PHISHING / FRAUD",
    },
    {
        "id": "phishing-website",
        "title": "Phishing Website",
        "category": "url",
        "payload": {"url": "http://hdfcbank-secure-login.top/"},
        "expected_label": "PHISHING / FRAUD",
    },
    {
        "id": "safe-website",
        "title": "Safe Website",
        "category": "url",
        "payload": {"url": "https://www.hdfcbank.com"},
        "expected_label": "REAL / SAFE",
    },
    {
        "id": "safe-gov-message",
        "title": "Safe Government Message",
        "category": "message",
        "payload": {
            "text": "Your Aadhaar update request has been received. No action is required from you at this time. "
                    "Visit uidai.gov.in for status.",
        },
        "expected_label": "REAL / SAFE",
    },
    {
        "id": "safe-delivery",
        "title": "Safe Delivery Notification",
        "category": "message",
        "payload": {
            "text": "Your order #4471 has been shipped and will arrive by Thursday. Track it in the Amazon app.",
        },
        "expected_label": "REAL / SAFE",
    },
]


def get_scenario(scenario_id: str):
    for s in SCENARIOS:
        if s["id"] == scenario_id:
            return s
    return None
