"""
db.py
Database configuration for the TrustShield AI project.

Local development:
    SQLite is used automatically when DATABASE_URL is not set.

Production:
    PostgreSQL is used when DATABASE_URL is configured on Render.
    SQLAlchemy uses psycopg 3 as the PostgreSQL driver.
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


DB_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "trustshield.db",
)

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    f"sqlite:///{DB_PATH}",
)


if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg://",
        1,
    )


connect_args = (
    {"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {}
)


engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def init_db():
    from . import models  # noqa: F401

    Base.metadata.create_all(
        bind=engine
    )
