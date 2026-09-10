"""
Ingestion Pipeline Configuration Constants
All tunable parameters for the Quantum Knowledge Ingestion System.
"""

import os
from pathlib import Path

# ── Paths ─────────────────────────────────────────────────────────────────

BACKEND_DIR = Path(__file__).parent.parent
INGESTION_DIR = Path(__file__).parent
MIGRATIONS_DIR = BACKEND_DIR / "migrations"
SQLITE_PATH = BACKEND_DIR / "data" / "quantum_topics.sqlite3"
TOPICS_JSON_PATH = BACKEND_DIR / "app" / "data" / "quantum_topics.json"
SOURCES_JSON_PATH = INGESTION_DIR / "sources.json"
CANDIDATES_DIR = INGESTION_DIR / "data" / "candidates"

# ── Quality Gate ──────────────────────────────────────────────────────────

# Minimum composite quality score (0.0–1.0) for a candidate to pass automated checks.
# Records below this threshold are auto-rejected without admin review.
QUALITY_THRESHOLD: float = float(os.environ.get("INGESTION_QUALITY_THRESHOLD", "0.60"))

# ── HTTP Fetcher ──────────────────────────────────────────────────────────

# Maximum seconds to wait for any single HTTP fetch.
FETCH_TIMEOUT_SECONDS: int = int(os.environ.get("INGESTION_FETCH_TIMEOUT_SECONDS", "15"))

# Maximum raw HTML/text bytes to process per fetch (500 KB default).
MAX_CONTENT_BYTES: int = int(os.environ.get("INGESTION_MAX_CONTENT_BYTES", "500000"))

# User-Agent header sent with fetch requests.
FETCH_USER_AGENT = (
    "QuantumPlatformIngestion/1.0 "
    "(Smart India Hackathon — Educational Platform; "
    "contact: admin@quantumai-platform.dev)"
)

# ── Notation Compliance ───────────────────────────────────────────────────

# Phrases that are considered misleading simplifications and must NOT appear
# in any verified record. Checked case-insensitively.
FORBIDDEN_SIMPLIFICATIONS: list[str] = [
    "0 and 1 at the same time",
    "both 0 and 1 simultaneously",
    "both 0 and 1 at the same time",
    "is both 0 and 1",
    "can be both 0 and 1",
    "exists as both",
    "simultaneously 0 and 1",
    "superposition means being both",
]

# Minimum field lengths (characters) for automated acceptance.
MIN_SHORT_DEFINITION_LEN: int = 20
MAX_SHORT_DEFINITION_LEN: int = 500
MIN_DETAILED_EXPLANATION_LEN: int = 200

# ── Difficulty Levels ────────────────────────────────────────────────────

DIFFICULTY_LEVELS = ("beginner", "intermediate", "advanced")

# ── Status Values ─────────────────────────────────────────────────────────

STATUS_DRAFT = "draft"
STATUS_PENDING_REVIEW = "pending_review"
STATUS_APPROVED = "approved"
STATUS_REJECTED = "rejected"
STATUS_PUBLISHED = "published"
STATUS_FAILED = "failed"

VALID_JOB_STATUSES = (
    STATUS_DRAFT,
    STATUS_PENDING_REVIEW,
    STATUS_APPROVED,
    STATUS_REJECTED,
    STATUS_PUBLISHED,
    STATUS_FAILED,
)

# ── Topic Categories ──────────────────────────────────────────────────────

VALID_CATEGORIES = (
    "Foundations",
    "Quantum Gates",
    "Algorithms",
    "Quantum Phenomena",
    "Techniques",
    "Visualization",
    "Error Correction",
    "Hardware",
    "Cryptography",
)
