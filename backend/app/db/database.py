from __future__ import annotations

from contextlib import contextmanager
from pathlib import Path
from threading import Lock
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings
from app.models.base import Base

_engine: Engine | None = None
_SessionLocal: sessionmaker[Session] | None = None
_lock = Lock()


def _build_engine(database_url: str) -> Engine:
    kwargs = {"future": True}
    if database_url.startswith("sqlite"):
        kwargs["connect_args"] = {"check_same_thread": False}
    return create_engine(database_url, **kwargs)


def configure_engine(database_url: str | None = None) -> Engine:
    global _engine, _SessionLocal
    with _lock:
        db_url = database_url or get_settings().database_url
        _engine = _build_engine(db_url)
        _SessionLocal = sessionmaker(bind=_engine, autoflush=False, autocommit=False, expire_on_commit=False)
        return _engine


def get_engine() -> Engine:
    global _engine
    if _engine is None:
        configure_engine()
    assert _engine is not None
    return _engine


def dispose_engine() -> None:
    global _engine, _SessionLocal
    with _lock:
        if _engine is not None:
            _engine.dispose()
        _engine = None
        _SessionLocal = None


def get_session_factory() -> sessionmaker[Session]:
    global _SessionLocal
    if _SessionLocal is None:
        configure_engine()
    assert _SessionLocal is not None
    return _SessionLocal


def init_db() -> None:
    engine = get_engine()
    # Import models so SQLAlchemy registers them before metadata creation.
    from app.models import download_log, material, user  # noqa: F401

    Base.metadata.create_all(bind=engine)


@contextmanager
def db_session() -> Iterator[Session]:
    session = get_session_factory()()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_db() -> Iterator[Session]:
    session = get_session_factory()()
    try:
        yield session
    finally:
        session.close()


