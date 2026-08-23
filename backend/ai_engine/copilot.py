"""
copilot.py
A lightweight, rule-based conversational assistant ("Cyber Copilot") that
gives plain-language cybersecurity guidance. Intentionally does NOT provide
any offensive-hacking help — only detection, prevention and response advice.
"""
import re

RESPONSES = [
    (
        re.compile(r"clicked.*(link|url)|clicked.*phishing", re.I),
        "If you clicked a suspicious link:\n\n"
        "1. Do not enter any login, OTP, PIN or card details on the page that opened.\n"
        "2. Close the browser tab immediately.\n"
        "3. If you entered credentials, change that password now and enable 2FA.\n"
        "4. If it was a banking link, call your bank's official fraud helpline and consider freezing the card/account.\n"
        "5. Run a security scan on your device.\n"
        "6. Report the link/number using cybercrime.gov.in (India) or your local cybercrime authority.",
    ),
    (
        re.compile(r"payment link|pay.*link|someone sent.*payment", re.I),
        "Unsolicited payment links are a common scam pattern:\n\n"
        "1. Never pay or enter card/UPI details through a link sent by a stranger.\n"
        "2. Genuine merchants don't need you to 'pay to receive money' — that request itself is a red flag.\n"
        "3. Verify the requester through a known, independent channel.\n"
        "4. Use Message Detector or URL Scanner above to check the link's Trust Score before doing anything.",
    ),
    (
        re.compile(r"kyc", re.I),
        "About KYC messages:\n\n"
        "1. Banks and RBI never ask you to update KYC by clicking a link in SMS/WhatsApp.\n"
        "2. Genuine KYC updates happen only via your bank's official app, website, or in-branch visit.\n"
        "3. If urgency and threats ('account will be blocked today') are present, treat it as a scam.\n"
        "4. Paste the exact message into Message Detector for a full risk breakdown.",
    ),
    (
        re.compile(r"trustworthy|is this website|safe website|check.*website", re.I),
        "To check if a website is trustworthy:\n\n"
        "1. Paste the URL into the URL Scanner above for a Trust Score and detailed breakdown.\n"
        "2. Look for HTTPS, a correctly spelled domain, and no unusual TLD (.xyz, .top, etc.).\n"
        "3. Avoid entering payment info on sites reached only via SMS/WhatsApp links — go directly via search or the official app instead.",
    ),
    (
        re.compile(r"is this message safe|is this safe|is this real|scam or not", re.I),
        "Paste the full message text into the Message Detector — it will check for urgency language, "
        "fake threats, embedded links, and requests for sensitive info, then give you a Trust Score with reasoning.",
    ),
    (
        re.compile(r"otp", re.I),
        "Never share an OTP with anyone — not your bank, not 'customer support', not a delivery agent. "
        "An OTP is the final approval step for a transaction; if someone is asking for it, they are usually "
        "trying to complete a transaction you did not authorize.",
    ),
    (
        re.compile(r"hack|exploit|crack password|bypass security", re.I),
        "I can't help with hacking, exploiting, or bypassing security systems — that's outside what TrustShield AI "
        "is built for. I'm focused purely on defensive guidance: detecting scams, phishing and fraud, and helping "
        "you respond safely if you've been targeted.",
    ),
]

FALLBACK = (
    "I can help you evaluate messages, links, emails and QR codes for scam/phishing risk, and give guidance "
    "on what to do if you've been targeted. Try asking things like:\n\n"
    "• \"Is this message safe?\"\n"
    "• \"Someone sent me a payment link, what should I do?\"\n"
    "• \"I clicked a suspicious link, what now?\"\n"
    "• \"I received a KYC message, is it real?\""
)


def ask_copilot(question: str) -> str:
    if not question or not question.strip():
        return FALLBACK
    for pattern, answer in RESPONSES:
        if pattern.search(question):
            return answer
    return FALLBACK
