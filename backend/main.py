"""
main.py

TrustShield AI backend — FastAPI application exposing scan, QR scan,
copilot, dashboard, history and demo-simulator endpoints.

Run locally from the backend directory with:

    python -m uvicorn main:app --reload --port 8000
"""

import uuid
from datetime import datetime, timedelta
from typing import Optional

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Depends,
    Header,
    HTTPException,
)

from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session
from sqlalchemy import func

from pydantic import BaseModel

from database.db import (
    get_db,
    init_db,
    SessionLocal,
)

from database.models import ScanRecord

from ai_engine.trust_score import run_scan
from ai_engine.copilot import ask_copilot
from ai_engine.qr_analysis import analyze_qr

from demo_data.scenarios import (
    SCENARIOS,
    get_scenario,
)


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="TrustShield AI API",
    version="1.0.0",
    description="TrustShield AI cybersecurity scanning backend",
)


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5176",

        # Production frontend
        "https://trustshield-ai-1-yj2s.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

MAX_MESSAGE_LENGTH = 10000
MAX_QR_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# ---------------------------------------------------------------------------
# Client Identification
# ---------------------------------------------------------------------------

def get_client_id(
    x_client_id: Optional[str] = Header(default=None),
) -> str:
    client_id = x_client_id or str(uuid.uuid4())

    print(">>> CLIENT ID:", client_id)

    return client_id
# ---------------------------------------------------------------------------
# Database Helpers
# ---------------------------------------------------------------------------

def _save_scan(
    db: Session,
    client_id: str,
    scan_type: str,
    input_preview: str,
    result: dict,
):
    """
    Save a scan result into the database
    for a specific client.
    """

    record = ScanRecord(
        client_id=client_id,
        scan_type=scan_type,
        input_summary=(input_preview or "")[:200],
        full_input=input_preview or "",
        score=result["score"],
        risk_level=result["risk_level"],
        classification=result["classification"],
        confidence=result["confidence"],
        indicator_count=result["indicator_count"],
    )

    db.add(record)

    print(">>> SAVE DB ENGINE:", db.bind.url)

    db.commit()
    db.refresh(record)

    print(">>> SAVED SCAN ID:", record.id)

    return record


def _seed_demo_history_if_empty():
    """
    Populate realistic demo scan history on first application run.
    """

    db = SessionLocal()

    try:
        count = db.query(ScanRecord).count()

        if count > 0:
            return

        # YAHAN TUMHARA EXISTING seed CODE RAHEGA
        # ...
        
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------

@app.on_event("startup")
def on_startup():
    """
    Initialize database and seed demo history on application startup.
    """

    init_db()
    _seed_demo_history_if_empty()
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# Request Models
# ---------------------------------------------------------------------------

class MessageScanRequest(BaseModel):
    text: str


class UrlScanRequest(BaseModel):
    url: str


class EmailScanRequest(BaseModel):
    sender: Optional[str] = ""
    subject: Optional[str] = ""
    body: str


class CopilotRequest(BaseModel):
    question: str


# ---------------------------------------------------------------------------
# Message Scanner
# ---------------------------------------------------------------------------

@app.post("/api/scan/message")
def scan_message(
    payload: MessageScanRequest,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """
    Scan SMS/message text.
    """

    if len(payload.text) > MAX_MESSAGE_LENGTH:
        raise HTTPException(
            status_code=413,
            detail=(
                "Message is too long. "
                "Maximum allowed length is 10,000 characters."
            ),
        )

    result = run_scan(
        "message",
        {
            "text": payload.text,
        },
    )

    if not result["valid"]:
        raise HTTPException(
            status_code=400,
            detail=result["error"],
        )

    _save_scan(
        db,
        client_id,
        "sms",
        payload.text,
        result,
    )

    return result


# ---------------------------------------------------------------------------
# URL Scanner
# ---------------------------------------------------------------------------

@app.post("/api/scan/url")
def scan_url(
    payload: UrlScanRequest,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """
    Scan a URL.
    """

    if len(payload.url) > 5000:
        raise HTTPException(
            status_code=413,
            detail="URL is too long.",
        )

    result = run_scan(
        "url",
        {
            "url": payload.url,
        },
    )

    if not result["valid"]:
        raise HTTPException(
            status_code=400,
            detail=result["error"],
        )

    _save_scan(
        db,
        client_id,
        "url",
        payload.url,
        result,
    )

    return result


# ---------------------------------------------------------------------------
# Email Scanner
# ---------------------------------------------------------------------------

@app.post("/api/scan/email")
def scan_email(
    payload: EmailScanRequest,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """
    Scan email sender, subject and body.
    """

    if len(payload.body) > MAX_MESSAGE_LENGTH:
        raise HTTPException(
            status_code=413,
            detail=(
                "Email body is too long. "
                "Maximum allowed length is 10,000 characters."
            ),
        )

    result = run_scan(
        "email",
        {
            "sender": payload.sender,
            "subject": payload.subject,
            "body": payload.body,
        },
    )

    if not result["valid"]:
        raise HTTPException(
            status_code=400,
            detail=result["error"],
        )

    preview = (
        f"{payload.subject or '(no subject)'} "
        f"— from {payload.sender or 'unknown'}"
    )

    _save_scan(
        db,
        client_id,
        "email",
        preview,
        result,
    )

    return result


# ---------------------------------------------------------------------------
# QR Code Scanner
# ---------------------------------------------------------------------------

@app.post("/api/scan/qr")
async def scan_qr(
    file: UploadFile = File(...),
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """
    Upload and scan a QR code image.
    """

    allowed_types = {
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid file type. "
                "Please upload a PNG, JPG, JPEG or WEBP QR image."
            ),
        )

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    if len(image_bytes) > MAX_QR_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="QR image is too large. Maximum allowed size is 10 MB.",
        )

    result = analyze_qr(image_bytes)

    if not result.get("valid"):
        raise HTTPException(
            status_code=400,
            detail=result.get(
                "error",
                "Could not decode a QR code from the uploaded image.",
            ),
        )

    decoded_data = (
        result.get("findings", {})
        .get("decoded_data", "")
    )

    if all(
        key in result
        for key in [
            "score",
            "risk_level",
            "classification",
            "confidence",
            "indicator_count",
        ]
    ):
        _save_scan(
            db,
            client_id,
            "qr",
            decoded_data,
            result,
        )

    return result


# ---------------------------------------------------------------------------
# Demo / Live Threat Simulator
# ---------------------------------------------------------------------------

@app.get("/api/demo/scenarios")
def list_scenarios():
    """
    Return available demo threat scenarios.
    """

    return [
        {
            "id": scenario["id"],
            "title": scenario["title"],
            "category": scenario["category"],
        }
        for scenario in SCENARIOS
    ]


@app.post("/api/demo/run/{scenario_id}")
def run_demo_scenario(
    scenario_id: str,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """
    Run a predefined threat simulation
    for the current client.
    """

    scenario = get_scenario(
        scenario_id,
    )

    if not scenario:
        raise HTTPException(
            status_code=404,
            detail="Scenario not found",
        )

    category = scenario["category"]
    payload = scenario["payload"]

    result = run_scan(
        category,
        payload,
    )

    result["simulated"] = True
    result["scenario_title"] = scenario["title"]

    if result["valid"]:

        preview = (
            payload.get("text")
            or payload.get("url")
            or payload.get("body")
            or scenario["title"]
        )

        scan_type_map = {
            "message": "sms",
            "url": "url",
            "email": "email",
            "qr": "qr",
        }

        _save_scan(
            db,
            client_id,
            scan_type_map.get(
                category,
                category,
            ),
            preview,
            result,
        )

    return result


# ---------------------------------------------------------------------------
# Copilot
# ---------------------------------------------------------------------------

@app.post("/api/copilot")
def copilot(
    payload: CopilotRequest,
):
    """
    Ask TrustShield AI Copilot a cybersecurity question.
    """

    result = ask_copilot(
        payload.question,
    )

    return {
        "reply": result,
    }


# ---------------------------------------------------------------------------
# Dashboard / Analytics
# ---------------------------------------------------------------------------

@app.get("/api/dashboard/stats")
def dashboard_stats(
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """
    Return dashboard statistics for the current client only.
    """

    base_query = db.query(ScanRecord).filter(
        ScanRecord.client_id == client_id
    )

    total = base_query.count()

    threats = (
        db.query(ScanRecord)
        .filter(
            ScanRecord.client_id == client_id,
            ScanRecord.risk_level.in_(
                [
                    "SUSPICIOUS",
                    "DANGEROUS",
                ]
            ),
        )
        .count()
    )

    safe = (
        db.query(ScanRecord)
        .filter(
            ScanRecord.client_id == client_id,
            ScanRecord.risk_level == "TRUSTED",
        )
        .count()
    )

    caution = (
        db.query(ScanRecord)
        .filter(
            ScanRecord.client_id == client_id,
            ScanRecord.risk_level == "CAUTION",
        )
        .count()
    )

    avg_score = (
        db.query(
            func.avg(ScanRecord.score)
        )
        .filter(
            ScanRecord.client_id == client_id
        )
        .scalar()
        or 0
    )

    # Scan count by type
    by_type = {}

    for scan_type, in (
        db.query(
            ScanRecord.scan_type
        )
        .filter(
            ScanRecord.client_id == client_id
        )
        .distinct()
    ):

        by_type[scan_type] = (
            db.query(ScanRecord)
            .filter(
                ScanRecord.client_id == client_id,
                ScanRecord.scan_type == scan_type,
            )
            .count()
        )

    # Risk level breakdown
    risk_breakdown = {}

    for level, in (
        db.query(
            ScanRecord.risk_level
        )
        .filter(
            ScanRecord.client_id == client_id
        )
        .distinct()
    ):

        risk_breakdown[level] = (
            db.query(ScanRecord)
            .filter(
                ScanRecord.client_id == client_id,
                ScanRecord.risk_level == level,
            )
            .count()
        )

    # Last 7 days trend
    trend = []

    for i in range(6, -1, -1):

        day = (
            datetime.utcnow()
            - timedelta(days=i)
        )

        day_start = day.replace(
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )

        day_end = (
            day_start
            + timedelta(days=1)
        )

        day_count = (
            db.query(ScanRecord)
            .filter(
                ScanRecord.client_id == client_id,
                ScanRecord.created_at >= day_start,
                ScanRecord.created_at < day_end,
            )
            .count()
        )

        day_threats = (
            db.query(ScanRecord)
            .filter(
                ScanRecord.client_id == client_id,
                ScanRecord.created_at >= day_start,
                ScanRecord.created_at < day_end,
                ScanRecord.risk_level.in_(
                    [
                        "SUSPICIOUS",
                        "DANGEROUS",
                    ]
                ),
            )
            .count()
        )

        trend.append(
            {
                "date": day_start.strftime("%a"),
                "scans": day_count,
                "threats": day_threats,
            }
        )

    return {
        "total_scans": total,
        "threats_detected": threats,
        "safe_messages": safe,
        "caution_count": caution,
        "average_trust_score": round(
            avg_score,
            1,
        ),
        "by_type": by_type,
        "risk_breakdown": risk_breakdown,
        "trend": trend,
    }


# ---------------------------------------------------------------------------
# Scan History
# ---------------------------------------------------------------------------

@app.get("/api/history")
def scan_history(
    limit: int = 50,
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """
    Return recent scan history
    for the current client only.
    """

    records = (
        db.query(ScanRecord)
        .filter(
            ScanRecord.client_id == client_id
        )
        .order_by(
            ScanRecord.created_at.desc()
        )
        .limit(limit)
        .all()
    )

    return [
        record.to_dict()
        for record in records
    ]


@app.delete("/api/history")
def clear_history(
    client_id: str = Depends(get_client_id),
    db: Session = Depends(get_db),
):
    """
    Delete scan history for the current client only.
    """

    db.query(ScanRecord).filter(
        ScanRecord.client_id == client_id
    ).delete(
        synchronize_session=False
    )

    db.commit()

    return {
        "status": "cleared",
    }


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health():
    """
    Backend health check.
    """

    return {
        "status": "ok",
        "service": "TrustShield AI Backend",
    }