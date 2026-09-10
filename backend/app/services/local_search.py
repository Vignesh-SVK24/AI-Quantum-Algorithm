"""
Local Database Search Engine for Hero Search Bar
Smart India Hackathon - Interactive Quantum Algorithm Learning Platform

Executes direct, deterministic search against the Quantum Knowledge Base table.
Primary Engine: Supabase PostgreSQL (via official SDK).
Fallback Engine: Local SQLite cache (backend/data/quantum_knowledge_base.sqlite3).

STRICT GUARANTEE:
Zero Gemini API calls.
Zero external web search requests (Tavily/arXiv/Wikipedia).
"""

import os
import re
import json
import sqlite3
import logging
from typing import TypedDict, List, Optional

logger = logging.getLogger("local_search")

class SearchResultItem(TypedDict):
    id: str
    topic: str
    title: str
    tags: List[str]
    summary: str
    source: str
    url: str
    match_score: float

class LocalSearchResponse(TypedDict):
    query: str
    answer: str
    classification: str
    results: List[SearchResultItem]
    sources: List[dict]
    storage_engine: str
    is_verified: bool

_supabase_client = None

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

def score_and_rank_records(records: list[dict], query: str) -> list[SearchResultItem]:
    """Calculates keyword relevance score for matched database records."""
    q_tokens = [t.lower() for t in re.findall(r'\b[a-zA-Z0-9_\-\+]+\b', query) if len(t) > 1]
    if not q_tokens:
        q_tokens = [query.lower().strip()]

    scored = []
    for r in records:
        score = 0.0
        title_lower = (r.get("title") or "").lower()
        summary_lower = (r.get("summary") or "").lower()
        id_lower = (r.get("id") or "").lower()
        
        tags = r.get("tags") or []
        if isinstance(tags, str):
            try:
                tags = json.loads(tags)
            except Exception:
                tags = [t.strip() for t in tags.split(",") if t.strip()]
        tags_lower = [str(t).lower() for t in tags]

        # Exact phrase bonus
        q_full = query.lower().strip()
        if q_full in title_lower:
            score += 10.0
        if q_full in id_lower:
            score += 8.0
        if q_full in " ".join(tags_lower):
            score += 6.0
        if q_full in summary_lower:
            score += 4.0

        # Token matches
        for t in q_tokens:
            if t in title_lower:
                score += 3.0
            if t in tags_lower:
                score += 2.5
            if t in summary_lower:
                score += 1.0

        if score > 0.0:
            scored.append({
                "id": r.get("id"),
                "topic": r.get("topic") or "Quantum Computing",
                "title": r.get("title") or "Quantum Concept",
                "tags": tags,
                "summary": r.get("summary") or "",
                "source": r.get("source") or "IBM Quantum Learning",
                "url": r.get("url") or "",
                "match_score": round(score, 2)
            })

    # Sort descending by match score
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return scored

def search_sqlite_fallback(query: str, max_results: int = 5) -> list[SearchResultItem]:
    """Queries local SQLite cache directly."""
    db_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "quantum_knowledge_base.sqlite3")
    if not os.path.exists(db_path):
        return []

    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        
        # Pull all candidate records for in-memory scoring
        cur.execute("SELECT id, topic, title, tags, summary, source, url FROM quantum_knowledge_base")
        rows = [dict(row) for row in cur.fetchall()]
        conn.close()
        
        ranked = score_and_rank_records(rows, query)
        return ranked[:max_results]
    except Exception as e:
        logger.warning(f"SQLite search failed: {e}")
        return []

def search_supabase_postgres(query: str, max_results: int = 5) -> Optional[list[SearchResultItem]]:
    """Queries Supabase table directly via REST client."""
    client = get_supabase_client()
    if not client:
        return None

    try:
        clean_q = re.sub(r'[^a-zA-Z0-9\s]', '', query).strip()
        tokens = [t for t in clean_q.split() if len(t) > 2]
        
        # Build filter condition
        filters = []
        if clean_q:
            filters.append(f"title.ilike.%{clean_q}%")
            filters.append(f"summary.ilike.%{clean_q}%")
        for t in tokens[:3]:
            filters.append(f"title.ilike.%{t}%")
            filters.append(f"summary.ilike.%{t}%")
            filters.append(f"id.ilike.%{t}%")

        filter_str = ",".join(filters) if filters else f"title.ilike.%{query}%"
        res = client.table("quantum_knowledge_base").select("*").or_(filter_str).limit(15).execute()
        
        records = res.data if hasattr(res, "data") else []
        if records:
            ranked = score_and_rank_records(records, query)
            return ranked[:max_results]
    except Exception as e:
        logger.warning(f"Supabase query failed ({e}); falling back to local SQLite cache.")
    
    return None

def search_quantum_db(query: str) -> LocalSearchResponse:
    """
    Main entry point for Hero Search Bar:
    1. Validates query.
    2. Checks for off-topic query.
    3. Queries Supabase PostgreSQL (with automatic SQLite local fallback).
    4. Formats clean, deterministic response without any LLM or external web calls.
    """
    clean_q = query.strip()
    if not clean_q:
        return {
            "query": "",
            "answer": "Please enter a quantum computing topic to search.",
            "classification": "empty_query",
            "results": [],
            "sources": [],
            "storage_engine": "none",
            "is_verified": True
        }

    # Off-topic filter
    q_lower = clean_q.lower()
    off_topic_words = ["recipe", "pizza", "weather", "football", "cricket", "movie", "song", "flight"]
    if any(w in q_lower for w in off_topic_words):
        return {
            "query": clean_q,
            "answer": (
                "I am specialized in **quantum computing concepts**! "
                "You can search for qubits, superposition, quantum gates (Hadamard, CNOT, Pauli), "
                "entanglement, the Bloch sphere, or algorithms (Grover's, Deutsch-Jozsa, Shor's)."
            ),
            "classification": "off_topic",
            "results": [],
            "sources": [],
            "storage_engine": "rule_filter",
            "is_verified": True
        }

    # 1. Try Supabase
    results = search_supabase_postgres(clean_q, max_results=4)
    storage_engine = "supabase_postgres"

    # 2. Fallback to SQLite
    if not results:
        results = search_sqlite_fallback(clean_q, max_results=4)
        storage_engine = "sqlite_local"

    # Assemble answer text from matched knowledge base entries
    if results:
        top_hit = results[0]
        answer_parts = [
            f"### {top_hit['title']} ({top_hit['topic']})\n",
            top_hit["summary"]
        ]
        if len(results) > 1:
            related_topics = [f"**{r['title']}**" for r in results[1:4]]
            answer_parts.append(f"\n*Related in database:* {', '.join(related_topics)}")

        answer_text = "\n".join(answer_parts)
    else:
        answer_text = (
            f"No direct match found in the Quantum Knowledge Base for '{clean_q}'. "
            "Try searching for core topics like **qubit**, **superposition**, **Hadamard**, **CNOT**, "
            "**entanglement**, **Bloch sphere**, or **Grover's algorithm**."
        )

    sources = [
        {
            "id": r["id"],
            "name": r["source"],
            "title": r["title"],
            "url": r["url"],
            "snippet": r["summary"][:200] + "...",
            "source_type": "database",
            "topic": r["topic"],
            "storage_engine": storage_engine
        }
        for r in results
    ]

    return {
        "query": clean_q,
        "answer": answer_text,
        "classification": "concept_database_match" if results else "no_match",
        "results": results,
        "sources": sources,
        "storage_engine": storage_engine,
        "is_verified": True
    }
