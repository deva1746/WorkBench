"""Database engine, session factory, and dependency injection helpers."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings

settings = get_settings()

# SQLAlchemy engine connects to PostgreSQL using the configured URL.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
)

# SessionLocal creates isolated DB sessions per request.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""


def get_db():
    """
    FastAPI dependency that yields a database session and ensures cleanup.

    Usage:
        @router.get("/items")
        def read_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
