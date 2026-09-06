"""
models.py
ORM models for the TrustShield AI prototype database.
"""
from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime, Text

from .db import Base


class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String(100), index=True, nullable=False)
    scan_type = Column(String(20), index=True)          # message | url | qr | email
    input_summary = Column(Text)                          # truncated preview of input
    score = Column(Float)
    risk_level = Column(String(20), index=True)           # TRUSTED/CAUTION/SUSPICIOUS/DANGEROUS
    classification = Column(String(30))                   # REAL/SAFE, PHISHING/FRAUD, ...
    confidence = Column(Float)
    indicator_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "scan_type": self.scan_type,
            "input_summary": self.input_summary,
            "score": self.score,
            "risk_level": self.risk_level,
            "classification": self.classification,
            "confidence": self.confidence,
            "indicator_count": self.indicator_count,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
