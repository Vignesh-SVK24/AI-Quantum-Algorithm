"""
Quantum Topics Local Database Search Engine
Smart India Hackathon - Interactive Quantum Algorithm Learning Platform

STRICT ARCHITECTURAL GUARANTEES:
1. Pure local database search (Supabase PostgreSQL with local SQLite / JSON cache fallback).
2. ZERO Google Gemini API requests.
3. ZERO live external web searches (Tavily, arXiv, Wikipedia, etc.).
4. Complete architectural separation from the AI Quantum Tutor.
"""

import os
import re
import json
import sqlite3
import difflib
import logging
from typing import TypedDict, List, Optional, Dict, Any

logger = logging.getLogger("local_search")

class SourceItem(TypedDict):
    title: str
    url: str

class TopicRecord(TypedDict):
    id: str
    topic_name: str
    slug: str
    category: str
    short_definition: str
    beginner_explanation: str
    detailed_explanation: str
    mathematical_explanation: Optional[str]
    formula: Optional[str]
    example: Optional[str]
    circuit_example: Optional[str]
    related_topics: List[str]
    common_mistakes: List[str]
    aliases: List[str]
    keywords: List[str]
    tags: List[str]
    source_name: Optional[str]
    source_url: Optional[str]
    additional_sources: List[SourceItem]
    verification_status: str

class QuantumTopicSearchResponse(TypedDict):
    query: str
    matched: bool
    topic: Optional[TopicRecord]
    did_you_mean: Optional[str]
    related_topics: List[str]
    storage_engine: str
    is_verified: bool
    message: Optional[str]

_supabase_client = None
_cached_topics: Optional[List[Dict[str, Any]]] = None
_cached_engine: Optional[str] = None
_supabase_attempted: bool = False

def load_env_if_needed():
    if not os.environ.get("SUPABASE_URL"):
        env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())

def get_supabase_client():
    """Initializes or returns cached Supabase client."""
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    
    load_env_if_needed()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if url and key:
        try:
            from supabase import create_client
            _supabase_client = create_client(url, key)
            return _supabase_client
        except Exception as e:
            logger.warning(f"Failed to initialize Supabase client: {e}")
    return None

def load_all_topics() -> tuple[List[Dict[str, Any]], str]:
    """
    Loads all topics with in-memory caching:
    1. Local SQLite table (backend/data/quantum_topics.sqlite3) - 0ms latency, 100% offline resilient
    2. Bundled JSON file (backend/app/data/quantum_topics.json) - static fallback
    3. Remote Supabase PostgreSQL table 'quantum_topics'
    Returns (topics_list, storage_engine_name)
    """
    global _cached_topics, _cached_engine
    if _cached_topics is not None and _cached_engine is not None:
        return _cached_topics, _cached_engine

    # 1. Local SQLite cache (offline-first, zero latency)
    sqlite_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "quantum_topics.sqlite3"))
    if os.path.exists(sqlite_path):
        try:
            conn = sqlite3.connect(sqlite_path)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM quantum_topics")
            rows = cur.fetchall()
            conn.close()
            if rows:
                topics = []
                for r in rows:
                    d = dict(r)
                    for list_field in ["related_topics", "common_mistakes", "aliases", "keywords", "tags", "additional_sources", "canonical_circuit"]:
                        if isinstance(d.get(list_field), str) and d[list_field]:
                            try:
                                d[list_field] = json.loads(d[list_field])
                            except Exception:
                                pass
                    topics.append(d)
                _cached_topics = topics
                _cached_engine = "sqlite_local_cache"
                return _cached_topics, _cached_engine
        except Exception as e:
            logger.warning(f"SQLite query failed: {e}")

    # 2. Bundled JSON file
    json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "quantum_topics.json"))
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                _cached_topics = data
                _cached_engine = "bundled_json_cache"
                return _cached_topics, _cached_engine
        except Exception as e:
            logger.warning(f"Failed to load bundled JSON: {e}")

    # 3. Supabase PostgreSQL
    sb = get_supabase_client()
    if sb:
        try:
            res = sb.table("quantum_topics").select("*").limit(50).execute()
            if res.data and len(res.data) > 0:
                _cached_topics = res.data
                _cached_engine = "supabase_postgresql"
                return _cached_topics, _cached_engine
        except Exception as e:
            logger.debug(f"Supabase query: {e}")

    return [], "none"

def clear_topic_cache() -> None:
    """Clears the in-memory topic cache so subsequent searches re-read from storage."""
    global _cached_topics, _cached_engine
    _cached_topics = None
    _cached_engine = None

def normalize_query(query: str) -> str:
    """Normalizes search query: lowercases, trims, removes excess whitespace, punctuation, and possessive 's."""
    q = query.lower().strip()
    q = q.replace("|0⟩", "|0>").replace("|1⟩", "|1>").replace("|+⟩", "|+>").replace("|-⟩", "|->")
    q = re.sub(r"['’]s\b", "", q)
    q = re.sub(r'[^\w\s\-\+>]', ' ', q)
    q = re.sub(r'\s+', ' ', q).strip()
    return q

def strip_filler_words(query: str) -> str:
    """Strips conversational prefixes like 'what is a', 'tell me about', etc."""
    q = query
    filler_patterns = [
        r'^(what\s+is\s+(an?\s+)?|what\s+are\s+(the\s+)?|what\s+does\s+(an?\s+)?|how\s+does\s+(an?\s+)?)',
        r'^(tell\s+me\s+about\s+(the\s+)?|explain\s+(the\s+)?|describe\s+(the\s+)?|can\s+you\s+explain\s+)',
        r'^(give\s+me\s+(an?\s+)?|show\s+me\s+(the\s+)?|information\s+on\s+|details\s+about\s+)'
    ]
    for pattern in filler_patterns:
        q = re.sub(pattern, '', q, flags=re.IGNORECASE).strip()
    return q

def search_quantum_db(query: str) -> QuantumTopicSearchResponse:
    """
    Main Search Entry Point:
    Searches the Quantum Encyclopedia for a matching topic record.
    Returns verified educational topic card, did-you-mean suggestion, or failure notice.
    Guaranteed 0 Gemini requests and 0 external web requests.
    """
    if not query or not query.strip():
        raise ValueError("Search query cannot be empty.")

    raw_query = query.strip()
    norm_q = normalize_query(raw_query)
    stripped_q = strip_filler_words(norm_q)

    topics, engine = load_all_topics()
    if not topics:
        return {
            "query": raw_query,
            "matched": False,
            "topic": None,
            "did_you_mean": None,
            "related_topics": [],
            "storage_engine": engine,
            "is_verified": False,
            "message": "No matching quantum topic was found in the Quantum Knowledge Base."
        }

    # =========================================================================
    # STEP 1: EXACT MATCHES (Evaluated globally in priority order)
    # Priority: exact topic-name match -> exact alias match -> stripped query match -> exact keyword match
    # =========================================================================

    # Pass 1a: Exact topic name or slug match across ALL topics
    for t in topics:
        t_name = t.get("topic_name", "")
        name_lower = t_name.lower().strip()
        name_norm = normalize_query(t_name)
        slug_lower = t.get("slug", "").lower().strip()

        if norm_q in (name_lower, slug_lower, name_norm) or norm_q.replace("s ", " ") == name_norm:
            return _build_match_response(raw_query, t, engine)

    # Pass 1b: Exact alias match across ALL topics
    for t in topics:
        aliases = [a.lower().strip() for a in t.get("aliases", []) if a]
        norm_aliases = [normalize_query(a) for a in aliases if a]

        if (
            norm_q in aliases
            or norm_q in norm_aliases
            or norm_q.replace("s ", " ") in norm_aliases
        ):
            return _build_match_response(raw_query, t, engine)

    # Pass 1c: Stripped conversational query match across ALL topics
    if stripped_q and stripped_q != norm_q:
        for t in topics:
            t_name = t.get("topic_name", "")
            name_lower = t_name.lower().strip()
            name_norm = normalize_query(t_name)
            slug_lower = t.get("slug", "").lower().strip()
            aliases = [a.lower().strip() for a in t.get("aliases", []) if a]
            norm_aliases = [normalize_query(a) for a in aliases if a]

            if (
                stripped_q in (name_lower, slug_lower, name_norm)
                or stripped_q.replace("s ", " ") == name_norm
                or stripped_q in aliases
                or stripped_q in norm_aliases
            ):
                return _build_match_response(raw_query, t, engine)

    # Pass 1d: Exact keyword match across ALL topics (only if no name/alias matched)
    for t in topics:
        keywords = [k.lower().strip() for k in t.get("keywords", []) if k]
        norm_keywords = [normalize_query(k) for k in keywords if k]

        if (
            norm_q in keywords
            or norm_q in norm_keywords
            or (stripped_q and (stripped_q in keywords or stripped_q in norm_keywords))
        ):
            return _build_match_response(raw_query, t, engine)

    # =========================================================================
    # STEP 2: CLOSE MISSPELLING / DID-YOU-MEAN CHECK
    # Check if the query is a close typo of an existing topic or alias
    # =========================================================================
    candidates: Dict[str, str] = {}
    for t in topics:
        t_name = t.get("topic_name", "")
        candidates[t_name.lower().strip()] = t_name
        for a in t.get("aliases", []):
            if a and len(a) > 2:
                candidates[a.lower().strip()] = t_name

    best_ratio = 0.0
    best_suggest: Optional[str] = None
    for cand_str, cand_topic_name in candidates.items():
        r1 = difflib.SequenceMatcher(None, norm_q, cand_str).ratio()
        r2 = difflib.SequenceMatcher(None, stripped_q, cand_str).ratio() if stripped_q else 0.0
        r = max(r1, r2)
        if r > best_ratio:
            best_ratio = r
            best_suggest = cand_topic_name

    # If similarity is between 0.70 and 0.999 (close typo, not exact match)
    if best_ratio >= 0.70 and best_ratio < 1.0 and best_suggest:
        return {
            "query": raw_query,
            "matched": False,
            "topic": None,
            "did_you_mean": best_suggest,
            "related_topics": [],
            "storage_engine": engine,
            "is_verified": False,
            "message": f"Did you mean: {best_suggest}?"
        }

    # =========================================================================
    # STEP 3: SUBSTRING / PARTIAL MATCHES
    # =========================================================================
    for t in topics:
        t_name = t.get("topic_name", "")
        name_lower = t_name.lower().strip()
        aliases = [a.lower().strip() for a in t.get("aliases", []) if a]

        # If query is substring of name (e.g. "Bloch" in "Bloch Sphere")
        if len(norm_q) >= 3 and norm_q in name_lower:
            return _build_match_response(raw_query, t, engine)
        if stripped_q and len(stripped_q) >= 3 and stripped_q in name_lower:
            return _build_match_response(raw_query, t, engine)

        # If topic name is contained in the query
        if len(name_lower) >= 3 and name_lower in norm_q:
            return _build_match_response(raw_query, t, engine)

        # If an alias is contained as a distinct phrase in query
        for a in aliases:
            if len(a) >= 4 and (f" {a} " in f" {norm_q} " or (stripped_q and f" {a} " in f" {stripped_q} ")):
                return _build_match_response(raw_query, t, engine)

    # =========================================================================
    # STEP 4: TOKEN OVERLAP IN TOPIC NAME
    # =========================================================================
    q_tokens = set([w for w in norm_q.split() if len(w) > 3])
    best_token_topic = None
    max_token_overlap = 0
    for t in topics:
        name_tokens = set([w for w in t.get("topic_name", "").lower().split() if len(w) > 3])
        overlap = len(q_tokens.intersection(name_tokens))
        if overlap > max_token_overlap:
            max_token_overlap = overlap
            best_token_topic = t

    if max_token_overlap >= 1 and best_token_topic:
        return _build_match_response(raw_query, best_token_topic, engine)

    # =========================================================================
    # STEP 5: BROADER FUZZY MATCH SUGGESTION (Cutoff 0.58)
    # =========================================================================
    if best_ratio >= 0.58 and best_suggest:
        return {
            "query": raw_query,
            "matched": False,
            "topic": None,
            "did_you_mean": best_suggest,
            "related_topics": [],
            "storage_engine": engine,
            "is_verified": False,
            "message": f"Did you mean: {best_suggest}?"
        }

    # =========================================================================
    # STEP 6: NO MATCH FOUND
    # =========================================================================
    return {
        "query": raw_query,
        "matched": False,
        "topic": None,
        "did_you_mean": None,
        "related_topics": [],
        "storage_engine": engine,
        "is_verified": False,
        "message": "No matching quantum topic was found in the Quantum Knowledge Base."
    }

def _build_match_response(query: str, topic: Dict[str, Any], engine: str) -> QuantumTopicSearchResponse:
    related = topic.get("related_topics", [])
    if isinstance(related, str):
        try:
            related = json.loads(related)
        except Exception:
            related = []

    return {
        "query": query,
        "matched": True,
        "topic": topic,
        "did_you_mean": None,
        "related_topics": related,
        "storage_engine": engine,
        "is_verified": True,
        "message": None
    }
