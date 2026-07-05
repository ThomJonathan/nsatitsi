from __future__ import annotations

from base64 import urlsafe_b64decode, urlsafe_b64encode
import hashlib
import hmac
import json
from secrets import token_bytes
from typing import Any

from app.core.config import get_settings

_PASSWORD_ITERATIONS = 210_000
_SALT_BYTES = 16


def _encode_base64(data: bytes) -> str:
    return urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _decode_base64(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return urlsafe_b64decode(data + padding)


def hash_password(password: str, salt: bytes | None = None) -> str:
    if not password:
        raise ValueError("Password cannot be empty")
    salt = salt or token_bytes(_SALT_BYTES)
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, _PASSWORD_ITERATIONS)
    return f"pbkdf2_sha256${_PASSWORD_ITERATIONS}${_encode_base64(salt)}${_encode_base64(derived)}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, iterations_text, salt_text, hash_text = encoded.split("$")
        if algorithm != "pbkdf2_sha256":
            return False
        iterations = int(iterations_text)
        salt = _decode_base64(salt_text)
        expected = _decode_base64(hash_text)
        candidate = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
        return hmac.compare_digest(candidate, expected)
    except Exception:
        return False


def create_signed_token(payload: dict[str, Any]) -> str:
    settings = get_settings()
    body = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    signature = hmac.new(settings.auth_secret.encode("utf-8"), body, hashlib.sha256).digest()
    return f"{_encode_base64(body)}.{_encode_base64(signature)}"


def decode_signed_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    try:
        body_part, signature_part = token.split(".", 1)
        body = _decode_base64(body_part)
        signature = _decode_base64(signature_part)
        expected = hmac.new(settings.auth_secret.encode("utf-8"), body, hashlib.sha256).digest()
        if not hmac.compare_digest(signature, expected):
            raise ValueError("Invalid signature")
        return json.loads(body.decode("utf-8"))
    except Exception as exc:
        raise ValueError("Invalid token") from exc

