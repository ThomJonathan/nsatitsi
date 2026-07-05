from __future__ import annotations

from dataclasses import dataclass
from pathlib import PurePosixPath
from urllib.parse import quote
import re
from uuid import uuid4

from app.core.config import get_settings
from app.core.taxonomy import MaterialType


@dataclass(slots=True)
class StorageDescriptor:
    storage_key: str
    download_url: str
    provider: str = "mega"


class StorageService:
    def __init__(self) -> None:
        self.settings = get_settings()

    @staticmethod
    def _slugify(value: str) -> str:
        value = value.strip().lower()
        value = re.sub(r"[^a-z0-9]+", "-", value)
        value = re.sub(r"-+", "-", value).strip("-")
        return value or "material"

    def build_storage_key(self, material_type: MaterialType, file_name: str, title: str | None = None) -> str:
        ext = PurePosixPath(file_name).suffix.lower()
        slug = self._slugify(title or PurePosixPath(file_name).stem)
        unique = uuid4().hex[:12]
        return f"{material_type.value}/{slug}-{unique}{ext}"

    def resolve_download_url(self, storage_key: str, storage_url: str | None = None) -> str:
        if storage_url:
            return storage_url
        base = self.settings.mega_download_base_url.strip()
        if base:
            return f"{base.rstrip('/')}/{quote(storage_key)}"
        return f"mega://{storage_key}"

    def describe_upload_target(self, material_type: MaterialType, file_name: str, title: str | None = None) -> StorageDescriptor:
        storage_key = self.build_storage_key(material_type, file_name, title)
        download_url = self.resolve_download_url(storage_key)
        return StorageDescriptor(storage_key=storage_key, download_url=download_url)


storage_service = StorageService()

