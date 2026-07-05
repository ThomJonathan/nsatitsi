from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.taxonomy import MaterialType, Role
from app.models.download_log import DownloadLog
from app.models.material import Material
from app.models.user import User


class ReportingService:
    def dashboard_stats(self, session: Session) -> dict[str, object]:
        total_users = session.scalar(select(func.count()).select_from(User)) or 0
        total_students = session.scalar(select(func.count()).select_from(User).where(User.role == Role.STUDENT.value)) or 0
        total_admins = session.scalar(select(func.count()).select_from(User).where(User.role == Role.ADMIN.value)) or 0
        total_materials = session.scalar(select(func.count()).select_from(Material)) or 0
        total_downloads = session.scalar(select(func.count()).select_from(DownloadLog)) or 0

        material_breakdown: dict[str, int] = {}
        for material_type in MaterialType:
            material_breakdown[material_type.value] = session.scalar(
                select(func.count()).select_from(Material).where(Material.material_type == material_type.value)
            ) or 0

        level_breakdown: dict[str, int] = {}
        for level in ("primary", "junior", "senior"):
            level_breakdown[level] = session.scalar(
                select(func.count()).select_from(Material).where(Material.education_level == level)
            ) or 0

        return {
            "users": {
                "total": total_users,
                "students": total_students,
                "admins": total_admins,
            },
            "materials": {
                "total": total_materials,
                "by_type": material_breakdown,
                "by_level": level_breakdown,
            },
            "downloads": {
                "total": total_downloads,
            },
        }


reporting_service = ReportingService()

