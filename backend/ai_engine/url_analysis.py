"""
url_analysis.py
Heuristic URL / domain security analyzer. Runs entirely offline (no paid
threat-intel API required) so the hackathon demo works without internet.
"""
import re
from urllib.parse import urlparse

from .keywords import (
    URL_SHORTENERS, SUSPICIOUS_TLDS, TRUSTED_BRAND_KEYWORDS,
    OFFICIAL_DOMAINS, SAFE_TLDS,
)

IP_PATTERN = re.compile(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")


def _levenshtein(a: str, b: str) -> int:
    """Small, dependency-free edit-distance implementation for typosquat checks."""
    if a == b:
        return 0
    if len(a) == 0:
        return len(b)
    if len(b) == 0:
        return len(a)
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, start=1):
        cur = [i] + [0] * len(b)
        for j, cb in enumerate(b, start=1):
            cost = 0 if ca == cb else 1
            cur[j] = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
        prev = cur
    return prev[-1]


def analyze_url(raw_url: str) -> dict:
    """
    Analyze a single URL and return structured findings plus a list of
    (indicator, severity) tuples that risk_scoring.py will convert into a
    trust score.
    """
    indicators = []
    findings = {}

    if not raw_url or not raw_url.strip():
        return {
            "valid": False,
            "error": "Empty URL provided.",
            "indicators": [],
            "findings": {},
        }

    url = raw_url.strip()
    if not re.match(r"^[a-zA-Z][a-zA-Z\d+\-.]*://", url):
        # No scheme provided — assume http(s) was intended, but flag it.
        url = "http://" + url
        indicators.append(("No scheme (http/https) specified in link", "medium"))

    try:
        parsed = urlparse(url)
        domain = (parsed.netloc or "").lower().split("@")[-1].split(":")[0]
    except Exception:
        return {
            "valid": False,
            "error": "Could not parse the provided URL.",
            "indicators": [("Malformed URL", "high")],
            "findings": {},
        }

    if not domain:
        return {
            "valid": False,
            "error": "Could not extract a domain from the input.",
            "indicators": [("Malformed URL", "high")],
            "findings": {},
        }

    findings["domain"] = domain
    findings["scheme"] = parsed.scheme

    # --- HTTPS check -------------------------------------------------
    https = parsed.scheme == "https"
    findings["https"] = https
    if not https:
        indicators.append(("No HTTPS encryption detected", "high"))

    # --- IP-based URL --------------------------------------------------
    if IP_PATTERN.match(domain):
        indicators.append(("Raw IP address used instead of a domain name", "high"))
        findings["ip_based"] = True
    else:
        findings["ip_based"] = False

    # --- URL shorteners --------------------------------------------------
    if any(short in domain for short in URL_SHORTENERS):
        indicators.append(("Shortened URL hides the real destination", "medium"))
        findings["shortened"] = True
    else:
        findings["shortened"] = False

    # --- Suspicious TLD --------------------------------------------------
    if any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
        indicators.append((f"Uses an uncommon/high-risk top-level domain ({domain.split('.')[-1]})", "medium"))
        findings["suspicious_tld"] = True
    else:
        findings["suspicious_tld"] = False

    # --- Government/official safe TLD ------------------------------------
    is_official_tld = any(domain.endswith(tld) for tld in SAFE_TLDS)
    findings["official_tld"] = is_official_tld

    # --- Excess length / hyphen / digit obfuscation -----------------------
    if len(domain) > 40:
        indicators.append(("Unusually long domain name", "low"))
    hyphen_count = domain.count("-")
    if hyphen_count >= 3:
        indicators.append(("Excessive hyphens in domain (common obfuscation trick)", "medium"))
    digit_ratio = sum(c.isdigit() for c in domain) / max(len(domain), 1)
    if digit_ratio > 0.3:
        indicators.append(("High proportion of digits in domain name", "medium"))

    # --- Brand impersonation / typosquatting ------------------------------
    findings["impersonated_brand"] = None
    core_domain = domain.replace("www.", "")
    labels = core_domain.split(".")
    root_label = labels[0] if labels else core_domain

    for brand in TRUSTED_BRAND_KEYWORDS:
        official = OFFICIAL_DOMAINS.get(brand, "")
        if brand in core_domain and core_domain != official and not core_domain.endswith("." + official):
            indicators.append((f"Domain references brand '{brand}' but is not the official domain ({official})", "critical"))
            findings["impersonated_brand"] = brand
            break
        # typosquat distance check against the official domain's root label
        if official:
            official_root = official.split(".")[0]
            dist = _levenshtein(root_label, official_root)
            if 0 < dist <= 2 and root_label != official_root:
                indicators.append((f"Domain closely resembles '{official}' (possible typosquat)", "critical"))
                findings["impersonated_brand"] = brand
                break

    # --- Redirect / query obfuscation indicators --------------------------
    query = parsed.query or ""
    if "redirect" in query.lower() or "url=" in query.lower() or "next=" in query.lower():
        indicators.append(("URL contains a redirect parameter", "low"))

    if "@" in raw_url:
        indicators.append(("URL contains '@' which can hide the real destination", "high"))

    findings["path"] = parsed.path
    findings["full_url"] = url

    return {
        "valid": True,
        "error": None,
        "indicators": indicators,
        "findings": findings,
    }
