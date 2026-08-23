"""
qr_analysis.py

Decodes an uploaded QR code image and analyzes the extracted payload.

URL QR codes are analyzed using url_analysis.py.
Non-URL QR payloads are analyzed using message_analysis.py.
UPI payment QR codes receive a dedicated payment-safety analysis.
"""

import io

import cv2
import numpy as np
from PIL import Image

from .url_analysis import analyze_url
from .message_analysis import analyze_message


# =========================================================
# QR DECODER
# =========================================================

def decode_qr(image_bytes: bytes) -> str | None:
    """
    Decode a QR code from uploaded image bytes.

    Uses multiple preprocessing strategies to improve
    detection for screenshots, resized QR codes,
    low contrast and slightly blurred images.
    """

    try:
        img = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        arr = np.array(img)

        # RGB -> BGR
        bgr = cv2.cvtColor(
            arr,
            cv2.COLOR_RGB2BGR,
        )

        detector = cv2.QRCodeDetector()

        variants = []

        # -------------------------------------------------
        # Original
        # -------------------------------------------------

        variants.append(bgr)

        # -------------------------------------------------
        # Grayscale
        # -------------------------------------------------

        gray = cv2.cvtColor(
            bgr,
            cv2.COLOR_BGR2GRAY,
        )

        variants.append(gray)

        # -------------------------------------------------
        # Upscaling
        # -------------------------------------------------

        height, width = gray.shape[:2]

        if max(height, width) < 2000:

            upscaled = cv2.resize(
                gray,
                None,
                fx=3,
                fy=3,
                interpolation=cv2.INTER_CUBIC,
            )

            variants.append(upscaled)

        # -------------------------------------------------
        # Slight blur
        # -------------------------------------------------

        blurred = cv2.GaussianBlur(
            gray,
            (3, 3),
            0,
        )

        variants.append(blurred)

        # -------------------------------------------------
        # Adaptive threshold
        # -------------------------------------------------

        adaptive = cv2.adaptiveThreshold(
            gray,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            31,
            5,
        )

        variants.append(adaptive)

        # -------------------------------------------------
        # Otsu threshold
        # -------------------------------------------------

        _, otsu = cv2.threshold(
            gray,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU,
        )

        variants.append(otsu)

        # -------------------------------------------------
        # Sharpen
        # -------------------------------------------------

        sharpen_kernel = np.array(
            [
                [0, -1, 0],
                [-1, 5, -1],
                [0, -1, 0],
            ],
            dtype=np.float32,
        )

        sharpened = cv2.filter2D(
            gray,
            -1,
            sharpen_kernel,
        )

        variants.append(sharpened)

        # -------------------------------------------------
        # Standard QR detection
        # -------------------------------------------------

        for variant in variants:

            try:

                data, points, _ = (
                    detector.detectAndDecode(
                        variant
                    )
                )

                if data and data.strip():
                    return data.strip()

            except Exception:
                continue

        # -------------------------------------------------
        # Multi QR detection
        # -------------------------------------------------

        for variant in variants:

            try:

                (
                    ok,
                    decoded_info,
                    points,
                    _,
                ) = detector.detectAndDecodeMulti(
                    variant
                )

                if ok and decoded_info:

                    for data in decoded_info:

                        if data and data.strip():
                            return data.strip()

            except Exception:
                continue

        return None

    except Exception:
        return None


# =========================================================
# QR ANALYSIS
# =========================================================

def analyze_qr(image_bytes: bytes) -> dict:
    """
    Decode and analyze a QR code.

    Important:
    A normal UPI payment QR is NOT automatically treated
    as a malicious or suspicious QR.

    It receives SAFE status with payment-safety guidance.

    Actual dangerous/suspicious QR content should be flagged
    by the relevant analyzer.
    """

    # -------------------------------------------------
    # Decode QR
    # -------------------------------------------------

    data = decode_qr(image_bytes)

    if not data:

        return {
            "valid": False,
            "error": (
                "Could not decode a QR code from "
                "the uploaded image."
            ),
            "score": 0,
            "risk_level": "UNKNOWN",
            "classification": "INVALID",
            "confidence": 0,
            "indicator_count": 0,
            "indicators": [],
            "findings": {},
        }

    # -------------------------------------------------
    # Base findings
    # -------------------------------------------------

    findings = {
        "decoded_data": data,
    }

    indicators = []

    # =================================================
    # UPI PAYMENT QR
    # =================================================

    if data.lower().startswith("upi://"):

        findings["payload_type"] = "upi_payment"

        # -------------------------------------------------
        # Basic UPI fields
        # -------------------------------------------------

        # Keep this as informational metadata only.
        # We do not treat the presence of a UPI URI as
        # evidence of fraud.
        findings["payment_request"] = True

        # -------------------------------------------------
        # Payment safety indicators
        # -------------------------------------------------

        indicators = [
            {
                "level": "INFO",
                "text": (
                    "This QR code contains a UPI payment request."
                ),
            },
            {
                "level": "INFO",
                "text": (
                    "Verify the recipient name and payment "
                    "amount before approving the transaction."
                ),
            },
            {
                "level": "INFO",
                "text": (
                    "Never enter your UPI PIN to receive money."
                ),
            },
        ]

        # -------------------------------------------------
        # Normal UPI QR = SAFE
        # -------------------------------------------------

        return {
            "valid": True,
            "error": None,

            # High trust because the payload itself is
            # a normal UPI payment URI.
            "score": 90,

            "risk_level": "SAFE",

            "classification": "PAYMENT_REQUEST",

            "confidence": 90,

            "indicator_count": len(indicators),

            "indicators": indicators,

            "findings": findings,
        }

    # =================================================
    # URL QR
    # =================================================

    is_url = (
        data.lower().startswith(
            (
                "http://",
                "https://",
                "www.",
            )
        )
        or "." in data
    )

    if is_url:

        findings["payload_type"] = "url"

        result = analyze_url(data)

        # -------------------------------------------------
        # Preserve analyzer indicators
        # -------------------------------------------------

        indicators.extend(
            result.get(
                "indicators",
                [],
            )
        )

        findings.update(
            result.get(
                "findings",
                {},
            )
        )

        return {
            "valid": result.get(
                "valid",
                True,
            ),
            "error": result.get(
                "error"
            ),
            "score": result.get(
                "score",
                0,
            ),
            "risk_level": result.get(
                "risk_level",
                "UNKNOWN",
            ),
            "classification": result.get(
                "classification",
                "UNKNOWN",
            ),
            "confidence": result.get(
                "confidence",
                0,
            ),
            "indicator_count": len(indicators),
            "indicators": indicators,
            "findings": findings,
        }

    # =================================================
    # TEXT QR
    # =================================================

    findings["payload_type"] = "text"

    result = analyze_message(data)

    indicators.extend(
        result.get(
            "indicators",
            [],
        )
    )

    findings.update(
        result.get(
            "findings",
            {},
        )
    )

    return {
        "valid": result.get(
            "valid",
            True,
        ),
        "error": result.get(
            "error"
        ),
        "score": result.get(
            "score",
            0,
        ),
        "risk_level": result.get(
            "risk_level",
            "UNKNOWN",
        ),
        "classification": result.get(
            "classification",
            "UNKNOWN",
        ),
        "confidence": result.get(
            "confidence",
            0,
        ),
        "indicator_count": len(indicators),
        "indicators": indicators,
        "findings": findings,
    }