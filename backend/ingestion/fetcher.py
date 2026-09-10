"""
Fetcher Module — Quantum Knowledge Ingestion Pipeline
Smart India Hackathon — Interactive Quantum Algorithm Learning Platform

Handles retrieval of quantum topic content from two modes:
  1. JSON Feed (MVP default): Load pre-structured candidate JSON files from disk.
  2. HTTP Fetch (future): Retrieve raw HTML/text from registered authoritative sources.

The student-facing Search Bar NEVER calls this module.
"""

import json
import logging
import time
import urllib.request
import urllib.error
from pathlib import Path
from typing import Any

from ingestion.config import (
    CANDIDATES_DIR,
    SOURCES_JSON_PATH,
    FETCH_TIMEOUT_SECONDS,
    MAX_CONTENT_BYTES,
    FETCH_USER_AGENT,
)

logger = logging.getLogger("ingestion.fetcher")


# ── Source Registry ───────────────────────────────────────────────────────

def load_sources() -> list[dict[str, Any]]:
    """Load the authoritative source registry from sources.json."""
    if not SOURCES_JSON_PATH.exists():
        logger.warning(f"sources.json not found at {SOURCES_JSON_PATH}")
        return []
    with open(SOURCES_JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_source_by_id(source_id: str) -> dict[str, Any] | None:
    """Look up a source registry entry by its ID."""
    for source in load_sources():
        if source.get("id") == source_id:
            return source
    return None


# ── Mode 1: JSON Feed (MVP) ───────────────────────────────────────────────

def load_candidate_file(filepath: Path) -> list[dict[str, Any]]:
    """
    Load candidate quantum topic records from a JSON file.

    The file may contain either:
      - A single topic dict: {...}
      - A list of topic dicts: [{...}, {...}, ...]

    Args:
        filepath: Absolute path to the candidate JSON file.

    Returns:
        List of raw candidate dicts (unverified, unstructured).
    """
    if not filepath.exists():
        raise FileNotFoundError(f"Candidate file not found: {filepath}")

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    if isinstance(data, dict):
        candidates = [data]
    elif isinstance(data, list):
        candidates = data
    else:
        raise ValueError(f"Candidate file must contain a dict or list, got {type(data)}")

    logger.info(f"[fetcher] Loaded {len(candidates)} candidate(s) from {filepath.name}")
    return candidates


def list_candidate_files(directory: Path | None = None) -> list[Path]:
    """
    List all .json candidate files in the candidates directory.

    Args:
        directory: Override directory path. Defaults to CANDIDATES_DIR.

    Returns:
        Sorted list of Path objects for each candidate JSON file.
    """
    target_dir = directory or CANDIDATES_DIR
    if not target_dir.exists():
        logger.warning(f"Candidates directory does not exist: {target_dir}")
        return []
    return sorted(target_dir.glob("*.json"))


def load_all_candidates(directory: Path | None = None) -> list[tuple[Path, dict[str, Any]]]:
    """
    Load all candidate files from the candidates directory.

    Returns:
        List of (filepath, candidate_dict) tuples — one per candidate record.
    """
    result: list[tuple[Path, dict[str, Any]]] = []
    for filepath in list_candidate_files(directory):
        try:
            candidates = load_candidate_file(filepath)
            for candidate in candidates:
                result.append((filepath, candidate))
        except Exception as e:
            logger.error(f"[fetcher] Failed to load {filepath.name}: {e}")
    logger.info(f"[fetcher] Loaded {len(result)} total candidate record(s) from disk")
    return result


# ── Mode 2: HTTP Fetch (for future real crawl) ────────────────────────────

def fetch_url(url: str, delay_ms: int = 1500) -> str:
    """
    Fetch raw text/HTML from a URL with rate limiting and size cap.

    Args:
        url: Target URL.
        delay_ms: Polite delay in milliseconds before fetching.

    Returns:
        Decoded text content (up to MAX_CONTENT_BYTES).

    Raises:
        RuntimeError: On HTTP error or timeout.
    """
    if delay_ms > 0:
        time.sleep(delay_ms / 1000.0)

    req = urllib.request.Request(url, headers={"User-Agent": FETCH_USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=FETCH_TIMEOUT_SECONDS) as response:
            raw_bytes = response.read(MAX_CONTENT_BYTES)
            encoding = response.headers.get_content_charset("utf-8")
            content = raw_bytes.decode(encoding, errors="replace")
            logger.info(
                f"[fetcher] HTTP GET {url} → {response.status} "
                f"({len(raw_bytes)} bytes)"
            )
            return content
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code} fetching {url}: {e.reason}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"URL error fetching {url}: {e.reason}") from e
    except TimeoutError as e:
        raise RuntimeError(f"Timeout fetching {url} after {FETCH_TIMEOUT_SECONDS}s") from e


def check_robots_txt(base_url: str, path: str = "/") -> bool:
    """
    Check whether the given path is allowed by the site's robots.txt.
    Returns True (allowed) if robots.txt cannot be fetched or parsed.

    Args:
        base_url: Base URL of the site (e.g., 'https://learning.quantum.ibm.com').
        path: The path we intend to fetch.

    Returns:
        True if fetching is allowed, False if disallowed.
    """
    try:
        from urllib.robotparser import RobotFileParser
        rp = RobotFileParser()
        robots_url = base_url.rstrip("/") + "/robots.txt"
        rp.set_url(robots_url)
        rp.read()
        allowed = rp.can_fetch(FETCH_USER_AGENT, base_url.rstrip("/") + path)
        logger.info(f"[fetcher] robots.txt for {base_url}: path '{path}' allowed={allowed}")
        return allowed
    except Exception as e:
        logger.warning(f"[fetcher] Could not read robots.txt for {base_url}: {e} — defaulting to allowed")
        return True
