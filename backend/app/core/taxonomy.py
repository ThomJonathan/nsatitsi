from __future__ import annotations

from enum import Enum
from typing import Final


class Role(str, Enum):
    ADMIN = "admin"
    STUDENT = "student"


class EducationLevel(str, Enum):
    PRIMARY = "primary"
    JUNIOR = "junior"
    SENIOR = "senior"


class MaterialType(str, Enum):
    BOOK = "book"
    PAMPHLET = "pamphlet"
    PAST_PAPER = "past_paper"
    ANSWER_SHEET = "answer_sheet"


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    PREFER_NOT = "prefer_not"


PRIMARY_CLASSES: Final[list[str]] = ["Std 5", "Std 6", "Std 7", "Std 8"]
JUNIOR_CLASSES: Final[list[str]] = ["Form 1", "Form 2"]
SENIOR_CLASSES: Final[list[str]] = ["Form 3", "Form 4"]

PRIMARY_SUBJECTS: Final[list[str]] = [
    "English",
    "Chichewa",
    "Mathematics",
    "Social Studies",
    "Expressive arts",
    "Bible knowledge",
    "Religious education",
    "Agriculture",
    "Science and technology",
]

SECONDARY_SUBJECTS: Final[list[str]] = [
    "English",
    "Chichewa",
    "Mathematics",
    "Social Studies",
    "Religious and Moral education",
    "Bible knowledge",
    "Business Studies",
    "Agriculture",
    "History",
    "Biology",
    "Physics",
    "Chemistry",
    "French",
    "Additional Mathematics",
    "Computer Studies",
    "Life Skills",
    "Geography",
    "Home Economics",
    "Physical Education",
    "Technical Drawing",
    "Woodwork",
    "Metalwork",
    "Creative Arts",
    "Clothing and Textiles",
]

ALL_SUBJECTS: Final[list[str]] = sorted({*PRIMARY_SUBJECTS, *SECONDARY_SUBJECTS})

LEVEL_TO_CLASSES: Final[dict[EducationLevel, list[str]]] = {
    EducationLevel.PRIMARY: PRIMARY_CLASSES,
    EducationLevel.JUNIOR: JUNIOR_CLASSES,
    EducationLevel.SENIOR: SENIOR_CLASSES,
}

LEVEL_TO_SUBJECTS: Final[dict[EducationLevel, list[str]]] = {
    EducationLevel.PRIMARY: PRIMARY_SUBJECTS,
    EducationLevel.JUNIOR: SECONDARY_SUBJECTS,
    EducationLevel.SENIOR: SECONDARY_SUBJECTS,
}

MATERIAL_TYPE_LABELS: Final[dict[MaterialType, str]] = {
    MaterialType.BOOK: "Book",
    MaterialType.PAMPHLET: "Pamphlet",
    MaterialType.PAST_PAPER: "Past Paper",
    MaterialType.ANSWER_SHEET: "Answer Sheet",
}


def is_allowed_class(level: EducationLevel, class_name: str) -> bool:
    return class_name in LEVEL_TO_CLASSES[level]


def is_allowed_subject(level: EducationLevel, subject: str) -> bool:
    return subject in LEVEL_TO_SUBJECTS[level]


def allowed_classes_for_level(level: EducationLevel) -> list[str]:
    return LEVEL_TO_CLASSES[level]


def allowed_subjects_for_level(level: EducationLevel) -> list[str]:
    return LEVEL_TO_SUBJECTS[level]


def normalize_text(value: str) -> str:
    return " ".join(value.strip().lower().split())


def build_dedupe_key(*parts: str) -> str:
    return "|".join(normalize_text(part) for part in parts if part)

