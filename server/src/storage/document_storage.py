from __future__ import annotations

import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile


CHUNK_SIZE = 1024 * 1024


@dataclass(frozen=True)
class StoredDocument:
    provider: str
    storage_key: str
    file_size: int


class DocumentStorage(ABC):
    @abstractmethod
    def save_policy_document(self, *, active_policy_id: int, upload: UploadFile) -> StoredDocument:
        raise NotImplementedError

    @abstractmethod
    def resolve_path(self, storage_key: str) -> Path:
        raise NotImplementedError

    @abstractmethod
    def delete(self, storage_key: str) -> None:
        raise NotImplementedError


class LocalDocumentStorage(DocumentStorage):
    provider_name = "local"

    def __init__(self, root_directory: Path):
        self.root_directory = root_directory.resolve()
        self.root_directory.mkdir(parents=True, exist_ok=True)

    def save_policy_document(
        self,
        *,
        active_policy_id: int,
        upload: UploadFile,
    ) -> StoredDocument:
        file_extension = Path(upload.filename or "").suffix
        relative_path = Path("policy_documents") / f"policy_{active_policy_id}" / (
            f"{uuid4().hex}{file_extension.lower()}"
        )
        absolute_path = self.resolve_path(str(relative_path))
        absolute_path.parent.mkdir(parents=True, exist_ok=True)

        total_size = 0

        try:
            upload.file.seek(0)
            with absolute_path.open("wb") as target:
                while True:
                    chunk = upload.file.read(CHUNK_SIZE)
                    if not chunk:
                        break
                    total_size += len(chunk)
                    target.write(chunk)
        except Exception:
            if absolute_path.exists():
                absolute_path.unlink()
            raise

        return StoredDocument(
            provider=self.provider_name,
            storage_key=str(relative_path).replace("\\", "/"),
            file_size=total_size,
        )

    def resolve_path(self, storage_key: str) -> Path:
        candidate = (self.root_directory / storage_key).resolve()
        if not str(candidate).startswith(str(self.root_directory)):
            raise ValueError("Storage key resolved outside configured document storage root")
        return candidate

    def delete(self, storage_key: str) -> None:
        path = self.resolve_path(storage_key)
        if path.exists():
            path.unlink()
            parent = path.parent
            while parent != self.root_directory and parent.exists():
                try:
                    parent.rmdir()
                except OSError:
                    break
                parent = parent.parent


def get_document_storage() -> DocumentStorage:
    provider = os.getenv("DOCUMENT_STORAGE_PROVIDER", "local").lower()
    if provider != "local":
        raise ValueError(f"Unsupported document storage provider: {provider}")

    configured_root = os.getenv("DOCUMENT_STORAGE_ROOT", "uploads")
    root_path = Path(configured_root)
    if not root_path.is_absolute():
        root_path = Path(__file__).resolve().parents[2] / root_path

    return LocalDocumentStorage(root_path)
