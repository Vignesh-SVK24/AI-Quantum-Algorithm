"""
Setup and Seed Script for Quantum Topics Encyclopedia
Smart India Hackathon - Interactive Quantum Algorithm Learning Platform

Seeds:
1. Local SQLite database: backend/data/quantum_topics.sqlite3
2. Remote Supabase PostgreSQL table: quantum_topics
"""

import os
import json
import sqlite3
import sys

def load_env():
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

def setup_sqlite(topics):
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "quantum_topics.sqlite3"))
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    cur.execute("""
    CREATE TABLE IF NOT EXISTS quantum_topics (
        id TEXT PRIMARY KEY,
        topic_name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        short_definition TEXT NOT NULL,
        beginner_explanation TEXT NOT NULL,
        detailed_explanation TEXT NOT NULL,
        mathematical_explanation TEXT,
        formula TEXT,
        example TEXT,
        circuit_example TEXT,
        related_topics TEXT NOT NULL,
        common_mistakes TEXT NOT NULL,
        aliases TEXT NOT NULL,
        keywords TEXT NOT NULL,
        tags TEXT NOT NULL,
        source_name TEXT,
        source_url TEXT,
        additional_sources TEXT,
        verification_status TEXT DEFAULT 'verified',
        created_at TEXT,
        updated_at TEXT
    );
    """)

    cur.execute("CREATE INDEX IF NOT EXISTS idx_qt_slug ON quantum_topics(slug);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_qt_cat ON quantum_topics(category);")

    for t in topics:
        cur.execute("""
        INSERT INTO quantum_topics (
            id, topic_name, slug, category, short_definition, beginner_explanation,
            detailed_explanation, mathematical_explanation, formula, example,
            circuit_example, related_topics, common_mistakes, aliases, keywords,
            tags, source_name, source_url, additional_sources, verification_status,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            topic_name=excluded.topic_name,
            slug=excluded.slug,
            category=excluded.category,
            short_definition=excluded.short_definition,
            beginner_explanation=excluded.beginner_explanation,
            detailed_explanation=excluded.detailed_explanation,
            mathematical_explanation=excluded.mathematical_explanation,
            formula=excluded.formula,
            example=excluded.example,
            circuit_example=excluded.circuit_example,
            related_topics=excluded.related_topics,
            common_mistakes=excluded.common_mistakes,
            aliases=excluded.aliases,
            keywords=excluded.keywords,
            tags=excluded.tags,
            source_name=excluded.source_name,
            source_url=excluded.source_url,
            additional_sources=excluded.additional_sources,
            verification_status=excluded.verification_status,
            updated_at=excluded.updated_at;
        """, (
            t["id"],
            t["topic_name"],
            t["slug"],
            t["category"],
            t["short_definition"],
            t["beginner_explanation"],
            t["detailed_explanation"],
            t.get("mathematical_explanation", ""),
            t.get("formula", ""),
            t.get("example", ""),
            t.get("circuit_example", ""),
            json.dumps(t.get("related_topics", [])),
            json.dumps(t.get("common_mistakes", [])),
            json.dumps(t.get("aliases", [])),
            json.dumps(t.get("keywords", [])),
            json.dumps(t.get("tags", [])),
            t.get("source_name", ""),
            t.get("source_url", ""),
            json.dumps(t.get("additional_sources", [])),
            t.get("verification_status", "verified"),
            t.get("created_at", ""),
            t.get("updated_at", "")
        ))

    conn.commit()
    conn.close()
    print(f"[OK] Seeded {len(topics)} topics into SQLite: {db_path}")

def setup_supabase(topics):
    load_env()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        print("[SKIP] SUPABASE_URL or SUPABASE_KEY not configured. Skipping remote seeding.")
        return False
    
    try:
        from supabase import create_client
        supabase = create_client(url, key)
        
        # Format payload for postgres (arrays and jsonb)
        payload = []
        for t in topics:
            item = dict(t)
            # Ensure array fields are python lists for PostgreSQL text[]
            item["related_topics"] = t.get("related_topics", [])
            item["common_mistakes"] = t.get("common_mistakes", [])
            item["aliases"] = t.get("aliases", [])
            item["keywords"] = t.get("keywords", [])
            item["tags"] = t.get("tags", [])
            payload.append(item)
            
        res = supabase.table("quantum_topics").upsert(payload).execute()
        print(f"[OK] Seeded {len(payload)} topics into Supabase table 'quantum_topics'!")
        return True
    except Exception as e:
        print(f"[NOTICE] Supabase upsert: {e}")
        return False

def main():
    json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app", "data", "quantum_topics.json"))
    if not os.path.exists(json_path):
        print(f"Error: {json_path} does not exist. Run generate_quantum_topics_data.py first.")
        sys.exit(1)
        
    with open(json_path, "r", encoding="utf-8") as f:
        topics = json.load(f)
        
    setup_sqlite(topics)
    setup_supabase(topics)

if __name__ == "__main__":
    main()
