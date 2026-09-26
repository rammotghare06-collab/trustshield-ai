"""
db.py
SQLite database configuration for TrustShield AI.
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# =========================================================
# DATABASE PATH
# =========================================================

DB_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "trustshield.db",
)


# =========================================================
# SQLITE DATABASE URL
# =========================================================

DATABASE_URL = f"sqlite:///{DB_PATH}"


# =========================================================
# SQLITE CONNECTION SETTINGS
# =========================================================

connect_args = {
    "check_same_thread": False
}


# =========================================================
# DATABASE ENGINE
# =========================================================

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)


# =========================================================
# DATABASE SESSION
# =========================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# =========================================================
# BASE MODEL
# =========================================================

Base = declarative_base()


# =========================================================
# DATABASE DEPENDENCY
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# INITIALIZE DATABASE
# =========================================================

def init_db():
    from . import models  # noqa: F401

    Base.metadata.create_all(
        bind=engine
    )
