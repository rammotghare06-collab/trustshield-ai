"""
keywords.py
Central dictionary of linguistic and financial-fraud indicators used by the
TrustShield AI risk engine. Supports English, Hindi (Devanagari) and Hinglish
(romanised Hindi) since the product targets Indian users.

These lists are intentionally kept as plain data so they are easy to extend
without touching the scoring logic.
"""

# ---------------------------------------------------------------------------
# Urgency / fear / pressure language
# ---------------------------------------------------------------------------
URGENCY_PATTERNS = [
    "urgent", "immediately", "act now", "right now", "expire", "expiring",
    "last chance", "final notice", "24 hours", "within 24", "today only",
    "will be blocked", "will be suspended", "will be deactivated",
    "account blocked", "account suspended", "account frozen",
    "jaldi", "abhi", "turant", "warna", "warna account", "jaldi se",
    "aaj hi", "turant karein", "band ho jayega", "block ho jayega",
]

THREAT_PATTERNS = [
    "account will be blocked", "account will be closed", "legal action",
    "your account has been compromised", "suspicious activity detected",
    "unauthorized login", "penalty", "fine", "police complaint",
    "account band", "case darj", "kanooni karwai",
]

REWARD_PATTERNS = [
    "you have won", "congratulations", "lucky winner", "claim your prize",
    "cashback", "free gift", "lottery", "jackpot", "reward points expiring",
    "aapne jeeta", "badhai ho", "inaam", "muft",
]

AUTHORITY_IMPERSONATION = [
    "rbi", "income tax department", "government of india", "sbi", "hdfc",
    "icici", "axis bank", "paytm", "phonepe", "google pay", "amazon",
    "flipkart", "irctc", "uidai", "aadhaar", "customer care", "bank manager",
    "cyber cell", "trai",
]

# ---------------------------------------------------------------------------
# Financial / fraud vocabulary (India specific)
# ---------------------------------------------------------------------------
FINANCIAL_FRAUD_TERMS = [
    "otp", "one time password", "pin", "cvv", "upi", "upi pin", "ifsc",
    "bank account", "account number", "credit card", "debit card",
    "net banking", "payment", "refund", "kyc", "kyc update", "kyc verify",
    "aadhaar", "pan card", "loan approved", "loan offer", "investment",
    "double your money", "cashback", "electricity bill", "bill due",
    "courier pending", "customs duty", "parcel held",
]

# ---------------------------------------------------------------------------
# Requests for sensitive action / social engineering
# ---------------------------------------------------------------------------
ACTION_REQUEST_PATTERNS = [
    "click the link", "click here", "verify your account", "update your kyc",
    "confirm your details", "share your otp", "enter your pin",
    "download the app", "install this app", "call this number",
    "share this message", "forward this message", "reply with",
    "link open kar", "link par click", "kyc update kar", "otp share kar",
    "otp batao", "pin batao",
]

GRAMMAR_RED_FLAGS = [
    "dear customer", "dear user", "valued customer", "kindly do the needful",
    "we are regret to inform", "your a winner", "congratulation you have",
]

# ---------------------------------------------------------------------------
# URL / domain related
# ---------------------------------------------------------------------------
URL_SHORTENERS = [
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly",
    "rebrand.ly", "cutt.ly", "shorturl.at", "tiny.cc", "rb.gy",
]

SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".club", ".info", ".click", ".loan", ".work", ".gq",
    ".tk", ".ml", ".cf", ".ga", ".biz", ".zip", ".fit",
]

TRUSTED_BRAND_KEYWORDS = [
    "sbi", "hdfc", "icici", "axis", "paytm", "phonepe", "amazon", "flipkart",
    "google", "microsoft", "apple", "irctc", "uidai", "rbi", "whatsapp",
    "facebook", "instagram", "netflix",
]

# Official-looking domains for the brands above, used to spot lookalikes
OFFICIAL_DOMAINS = {
    "sbi": "onlinesbi.sbi",
    "hdfc": "hdfcbank.com",
    "icici": "icicibank.com",
    "axis": "axisbank.com",
    "paytm": "paytm.com",
    "phonepe": "phonepe.com",
    "amazon": "amazon.in",
    "flipkart": "flipkart.com",
    "google": "google.com",
    "microsoft": "microsoft.com",
    "apple": "apple.com",
    "irctc": "irctc.co.in",
    "uidai": "uidai.gov.in",
    "rbi": "rbi.org.in",
    "whatsapp": "whatsapp.com",
    "facebook": "facebook.com",
    "instagram": "instagram.com",
    "netflix": "netflix.com",
}

SAFE_TLDS = [".gov.in", ".nic.in", ".gov", ".edu", ".ac.in"]
