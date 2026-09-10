"""
Publisher Module — Quantum Knowledge Ingestion Pipeline
Smart India Hackathon — Interactive Quantum Algorithm Learning Platform

Publishes approved quantum topic records to:
  1. Supabase PostgreSQL quantum_topics table (via REST API)
  2. Local SQLite cache (backend/data/quantum_topics.sqlite3)
  3. Optionally, the bundled JSON fallback (backend/app/data/quantum_topics.json)

Also manages the knowledge_ingestion_jobs audit table.

ARCHITECTURAL GUARANTEE:
  This module is ONLY called by admin CLI tools (run_ingestion.py, admin_review.py).
  It is NEVER called by FastAPI routes in backend/app/main.py.
  The student-facing Search Bar reads from SQLite / JSON / Supabase via local_search.py.
"""

import os
import json
import sqlite3
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from ingestion.config import SQLITE_PATH, TOPICS_JSON_PATH

logger = logging.getLogger("ingestion.publisher")


# ── Environment & Supabase Client ─────────────────────────────────────────

def _load_env() -> None:
    """Load .env from backend/.env if not already loaded."""
    if os.environ.get("SUPABASE_URL"):
        return
    env_path = Path(__file__).parent.parent / ".env"
    if not env_path.exists():
        return
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())


def _get_supabase_client():
    """Return a Supabase REST client (service role key)."""
    _load_env()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        raise EnvironmentError(
            "SUPABASE_URL and SUPABASE_KEY must be set in backend/.env"
        )
    from supabase import create_client
    return create_client(url, key)


# ── Job Management (knowledge_ingestion_jobs) ─────────────────────────────

def create_job(
    structured: dict[str, Any],
    quality_score: float,
    quality_report: dict[str, Any],
    source_id: str,
) -> str:
    """
    Insert a pending-review job into knowledge_ingestion_jobs via Supabase REST.

    Args:
        structured: The structured candidate dict (from structurer).
        quality_score: Float 0.0–1.0 from verifier.
        quality_report: Full VerificationReport.to_dict() from verifier.
        source_id: knowledge_sources.id for attribution.

    Returns:
        Job ID (UUID string).

    Raises:
        RuntimeError: On Supabase insert failure.
    """
    job_id = str(uuid.uuid4())
    slug = structured.get("slug") or structured.get("id", "unknown")

    job_record = {
        "id": job_id,
        "source_id": source_id,
        "target_topic_slug": slug,
        "status": "pending_review",
        "raw_content": None,  # JSON feed mode: no raw HTML
        "parsed_fields": structured,
        "quality_score": round(quality_score, 4),
        "quality_report": quality_report,
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    }

    try:
        sb = _get_supabase_client()
        result = sb.table("knowledge_ingestion_jobs").insert(job_record).execute()
        if result.data:
            logger.info(f"[publisher] Created job {job_id} for topic '{slug}' (score={quality_score:.2f})")
            return job_id
        else:
            raise RuntimeError(f"Supabase insert returned no data: {result}")
    except Exception as e:
        logger.error(f"[publisher] Failed to create job for '{slug}': {e}")
        raise RuntimeError(f"Failed to create ingestion job: {e}") from e


def list_pending_jobs() -> list[dict[str, Any]]:
    """
    Fetch all pending_review jobs from Supabase, ordered by submission time.

    Returns:
        List of knowledge_ingestion_jobs records.
    """
    try:
        sb = _get_supabase_client()
        result = (
            sb.table("knowledge_ingestion_jobs")
            .select("*")
            .eq("status", "pending_review")
            .order("submitted_at", desc=False)
            .execute()
        )
        return result.data or []
    except Exception as e:
        logger.error(f"[publisher] Failed to list pending jobs: {e}")
        raise RuntimeError(f"Failed to list pending jobs: {e}") from e


def update_job_status(
    job_id: str,
    status: str,
    admin_notes: str | None = None,
    rejection_reason: str | None = None,
) -> None:
    """
    Update a job's status in knowledge_ingestion_jobs.
    """
    update_data: dict[str, Any] = {
        "status": status,
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
    }
    if admin_notes:
        update_data["admin_notes"] = admin_notes
    if rejection_reason:
        update_data["rejection_reason"] = rejection_reason

    try:
        sb = _get_supabase_client()
        sb.table("knowledge_ingestion_jobs").update(update_data).eq("id", job_id).execute()
        logger.info(f"[publisher] Job {job_id} → status={status}")
    except Exception as e:
        logger.error(f"[publisher] Failed to update job {job_id}: {e}")
        raise RuntimeError(f"Failed to update job status: {e}") from e


# ── Publishing to quantum_topics ──────────────────────────────────────────

def _prepare_for_supabase(record: dict[str, Any]) -> dict[str, Any]:
    """
    Prepare a structured record for Supabase upsert:
    - Convert Python lists → JSON arrays (Supabase handles this automatically)
    - Remove tracking fields that should be set fresh on publish
    - Set verification_status = 'verified', status = 'approved'
    """
    publish_record = {k: v for k, v in record.items()}

    # Set publish-time fields
    publish_record["verification_status"] = "verified"
    publish_record["status"] = "approved"
    publish_record["last_verified_at"] = datetime.now(timezone.utc).isoformat()

    now = datetime.now(timezone.utc).isoformat()
    publish_record.setdefault("created_at", now)
    publish_record["updated_at"] = now

    # Increment knowledge_version if field is present
    current_version = publish_record.get("knowledge_version") or 1
    publish_record["knowledge_version"] = current_version

    return publish_record


def publish_to_supabase(record: dict[str, Any]) -> bool:
    """
    Upsert a verified+approved topic record to quantum_topics in Supabase.

    Args:
        record: Structured dict from structurer (already verified and admin-approved).

    Returns:
        True on success.

    Raises:
        RuntimeError: On upsert failure.
    """
    slug = record.get("slug") or record.get("id", "unknown")
    publish_record = _prepare_for_supabase(record)

    try:
        sb = _get_supabase_client()
        result = (
            sb.table("quantum_topics")
            .upsert(publish_record, on_conflict="slug")
            .execute()
        )
        if result.data is not None:
            logger.info(f"[publisher] Upserted '{slug}' → quantum_topics (Supabase)")
            return True
        else:
            raise RuntimeError(f"Supabase upsert returned no data: {result}")
    except Exception as e:
        logger.error(f"[publisher] Supabase upsert failed for '{slug}': {e}")
        raise RuntimeError(f"Supabase upsert failed: {e}") from e


def publish_to_sqlite(record: dict[str, Any]) -> bool:
    """
    Upsert a verified+approved topic record to the local SQLite cache.

    Args:
        record: Structured dict (already verified and admin-approved).

    Returns:
        True on success.
    """
    slug = record.get("slug") or record.get("id", "unknown")

    # Serialize lists/dicts to JSON strings for SQLite TEXT columns
    def _serialize(v: Any) -> str:
        if isinstance(v, (list, dict)):
            return json.dumps(v, ensure_ascii=False)
        if v is None:
            return ""
        return str(v)

    now = datetime.now(timezone.utc).isoformat()

    try:
        SQLITE_PATH.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(str(SQLITE_PATH))
        cursor = conn.cursor()

        # Ensure all ingestion tracking columns exist in the local SQLite
        _ensure_sqlite_schema(cursor)

        cursor.execute(
            """
            INSERT OR REPLACE INTO quantum_topics (
                id, topic_name, slug, category, subcategory,
                short_definition, beginner_explanation, detailed_explanation,
                mathematical_explanation, formula, example, circuit_example,
                related_topics, common_mistakes, aliases, keywords, tags,
                source_name, source_url, additional_sources,
                verification_status, status, knowledge_version,
                last_verified_at, verification_notes, ingestion_source_id,
                difficulty_level, created_at, updated_at
            ) VALUES (
                :id, :topic_name, :slug, :category, :subcategory,
                :short_definition, :beginner_explanation, :detailed_explanation,
                :mathematical_explanation, :formula, :example, :circuit_example,
                :related_topics, :common_mistakes, :aliases, :keywords, :tags,
                :source_name, :source_url, :additional_sources,
                :verification_status, :status, :knowledge_version,
                :last_verified_at, :verification_notes, :ingestion_source_id,
                :difficulty_level, :created_at, :updated_at
            )
            """,
            {
                "id": record.get("id") or slug,
                "topic_name": record.get("topic_name", ""),
                "slug": slug,
                "category": record.get("category", "Foundations"),
                "subcategory": record.get("subcategory") or None,
                "short_definition": record.get("short_definition", ""),
                "beginner_explanation": record.get("beginner_explanation", ""),
                "detailed_explanation": record.get("detailed_explanation", ""),
                "mathematical_explanation": record.get("mathematical_explanation") or None,
                "formula": record.get("formula") or None,
                "example": record.get("example") or None,
                "circuit_example": record.get("circuit_example") or None,
                "related_topics": _serialize(record.get("related_topics", [])),
                "common_mistakes": _serialize(record.get("common_mistakes", [])),
                "aliases": _serialize(record.get("aliases", [])),
                "keywords": _serialize(record.get("keywords", [])),
                "tags": _serialize(record.get("tags", [])),
                "source_name": record.get("source_name") or None,
                "source_url": record.get("source_url") or None,
                "additional_sources": _serialize(record.get("additional_sources", [])),
                "verification_status": "verified",
                "status": "approved",
                "knowledge_version": record.get("knowledge_version") or 1,
                "last_verified_at": now,
                "verification_notes": record.get("verification_notes") or None,
                "ingestion_source_id": record.get("ingestion_source_id") or None,
                "difficulty_level": record.get("difficulty_level") or None,
                "created_at": now,
                "updated_at": now,
            },
        )
        conn.commit()
        conn.close()
        logger.info(f"[publisher] Upserted '{slug}' → SQLite cache")
        return True
    except Exception as e:
        logger.error(f"[publisher] SQLite upsert failed for '{slug}': {e}")
        raise RuntimeError(f"SQLite upsert failed: {e}") from e


def _ensure_sqlite_schema(cursor: sqlite3.Cursor) -> None:
    """Add ingestion tracking columns to SQLite if they don't exist yet."""
    new_columns = [
        ("status",               "TEXT DEFAULT 'approved'"),
        ("knowledge_version",    "INTEGER DEFAULT 1"),
        ("last_verified_at",     "TEXT"),
        ("verification_notes",   "TEXT"),
        ("ingestion_source_id",  "TEXT"),
        ("difficulty_level",     "TEXT"),
        ("subcategory",          "TEXT"),
    ]
    cursor.execute("PRAGMA table_info(quantum_topics)")
    existing = {row[1] for row in cursor.fetchall()}

    for col_name, col_def in new_columns:
        if col_name not in existing:
            cursor.execute(
                f"ALTER TABLE quantum_topics ADD COLUMN {col_name} {col_def}"
            )
            logger.info(f"[publisher] Added column '{col_name}' to SQLite quantum_topics")


def refresh_json_fallback() -> bool:
    """
    Regenerate the bundled JSON fallback (backend/app/data/quantum_topics.json)
    from the current SQLite database contents.

    This keeps the JSON file in sync with the latest published records so that
    the offline-first fallback always reflects the current knowledge base.

    Returns:
        True on success.
    """
    try:
        conn = sqlite3.connect(str(SQLITE_PATH))
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM quantum_topics WHERE status = 'approved' OR status IS NULL "
            "ORDER BY category, topic_name"
        )
        rows = cursor.fetchall()
        conn.close()

        topics = []
        for row in rows:
            topic = dict(row)
            # Parse JSON-serialized array fields back to Python lists
            for arr_field in ["related_topics", "common_mistakes", "aliases", "keywords", "tags"]:
                raw = topic.get(arr_field)
                if raw and isinstance(raw, str):
                    try:
                        topic[arr_field] = json.loads(raw)
                    except json.JSONDecodeError:
                        topic[arr_field] = []
            # Parse additional_sources
            raw_as = topic.get("additional_sources")
            if raw_as and isinstance(raw_as, str):
                try:
                    topic["additional_sources"] = json.loads(raw_as)
                except json.JSONDecodeError:
                    topic["additional_sources"] = []
            topics.append(topic)

        TOPICS_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(TOPICS_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(topics, f, indent=2, ensure_ascii=False)

        logger.info(
            f"[publisher] Refreshed JSON fallback: {len(topics)} topics → {TOPICS_JSON_PATH}"
        )
        return True
    except Exception as e:
        logger.error(f"[publisher] Failed to refresh JSON fallback: {e}")
        raise RuntimeError(f"JSON fallback refresh failed: {e}") from e


# ── Combined Publish Flow ─────────────────────────────────────────────────

def publish_approved_record(
    record: dict[str, Any],
    job_id: str,
    admin_notes: str | None = None,
    skip_supabase: bool = False,
) -> dict[str, str]:
    """
    Full publish flow for an admin-approved record:
      1. Upsert to Supabase quantum_topics
      2. Upsert to local SQLite cache
      3. Refresh bundled JSON fallback
      4. Mark job as published in knowledge_ingestion_jobs

    Args:
        record: Structured dict to publish.
        job_id: The knowledge_ingestion_jobs.id being published.
        admin_notes: Optional notes from admin review.
        skip_supabase: If True, publish to SQLite/JSON only (useful offline).

    Returns:
        Dict with keys 'supabase', 'sqlite', 'json_fallback' → 'ok' or error message.
    """
    results: dict[str, str] = {}
    slug = record.get("slug") or record.get("id", "?")

    # 1. Supabase
    if not skip_supabase:
        try:
            publish_to_supabase(record)
            results["supabase"] = "ok"
        except Exception as e:
            results["supabase"] = f"ERROR: {e}"
            logger.warning(f"[publisher] Supabase publish failed for '{slug}', continuing to SQLite: {e}")
    else:
        results["supabase"] = "skipped"

    # 2. SQLite
    try:
        publish_to_sqlite(record)
        results["sqlite"] = "ok"
    except Exception as e:
        results["sqlite"] = f"ERROR: {e}"

    # 3. JSON fallback
    try:
        refresh_json_fallback()
        results["json_fallback"] = "ok"
    except Exception as e:
        results["json_fallback"] = f"ERROR: {e}"

    # 4. Mark job published
    try:
        update_job_status(
            job_id,
            status="published",
            admin_notes=admin_notes,
        )
        results["job_status"] = "published"
    except Exception as e:
        results["job_status"] = f"ERROR: {e}"

    logger.info(f"[publisher] Publish results for '{slug}': {results}")
    return results
