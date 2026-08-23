"""
db.py
SQLite database configuration for the TrustShield AI prototype.
Architecture is intentionally simple (SQLAlchemy + SQLite) so it can be
swapped for PostgreSQL/MySQL later by changing DATABASE_URL only.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "trustshield.db")
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{DB_PATH}")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from . import models  # noqa: F401  (ensures models are registered)
    Base.metadata.create_all(bind=engine)
