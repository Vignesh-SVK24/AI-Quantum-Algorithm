"""
Supabase PostgreSQL Database Provisioning and Seeding Script
Smart India Hackathon - Interactive Quantum Algorithm Learning Platform

1. Reads credentials from backend/.env (SUPABASE_URL, SUPABASE_KEY, DATABASE_URL).
2. Connects to Supabase PostgreSQL and creates table `quantum_knowledge_base`.
3. Creates a Full-Text Search (GIN) index on (title, summary, tags).
4. Seeds all 20 curated foundational entries from backend/app/knowledge_base.json.
5. Also creates a local fallback SQLite cache in backend/data/quantum_knowledge_base.sqlite3.
"""

import os
import sys
import json
import sqlite3

# Ensure app package is accessible
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.stdout.reconfigure(encoding="utf-8")

def load_env(env_path: str):
    """Simple .env file loader."""
    if not os.path.exists(env_path):
        return
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            os.environ.setdefault(key.strip(), val.strip())

def setup_supabase_postgres():
    """Connects to Supabase via psycopg2 and creates + seeds the table."""
    database_url = os.environ.get("DATABASE_URL", "").strip()
    if not database_url:
        print("[!] No DATABASE_URL found in environment.")
        return False

    try:
        import psycopg2
        from psycopg2.extras import execute_values
    except ImportError:
        print("[!] psycopg2 is not installed.")
        return False

    print(f"[*] Connecting to Supabase PostgreSQL...")
    try:
        conn = psycopg2.connect(database_url, connect_timeout=10)
        conn.autocommit = True
        cur = conn.cursor()

        # 1. Create table
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS quantum_knowledge_base (
            id TEXT PRIMARY KEY,
            topic VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            tags TEXT[] NOT NULL,
            summary TEXT NOT NULL,
            source VARCHAR(255) NOT NULL,
            url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_qkb_fts ON quantum_knowledge_base 
        USING gin(to_tsvector('english', title || ' ' || summary || ' ' || array_to_string(tags, ' ')));
        """
        cur.execute(create_table_sql)
        print("[+] Supabase table 'quantum_knowledge_base' and GIN index verified.")

        # 2. Load JSON entries
        kb_path = os.path.join(os.path.dirname(__file__), "..", "app", "knowledge_base.json")
        with open(kb_path, "r", encoding="utf-8") as f:
            entries = json.load(f)

        # 3. Upsert entries
        upsert_sql = """
        INSERT INTO quantum_knowledge_base (id, topic, title, tags, summary, source, url)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            topic = EXCLUDED.topic,
            title = EXCLUDED.title,
            tags = EXCLUDED.tags,
            summary = EXCLUDED.summary,
            source = EXCLUDED.source,
            url = EXCLUDED.url;
        """
        for item in entries:
            cur.execute(upsert_sql, (
                item["id"],
                item["topic"],
                item["title"],
                item.get("tags", []),
                item["summary"],
                item.get("source", ""),
                item.get("url", "")
            ))

        cur.execute("SELECT COUNT(*) FROM quantum_knowledge_base;")
        count = cur.fetchone()[0]
        print(f"[+] Successfully seeded {count} quantum knowledge base entries in Supabase PostgreSQL!")
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"[!] Supabase PostgreSQL connection error: {e}")
        return False

def setup_local_sqlite_cache():
    """Initializes local SQLite database as high-resilience fallback cache."""
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    os.makedirs(data_dir, exist_ok=True)
    db_path = os.path.join(data_dir, "quantum_knowledge_base.sqlite3")

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS quantum_knowledge_base (
        id TEXT PRIMARY KEY,
        topic TEXT NOT NULL,
        title TEXT NOT NULL,
        tags TEXT NOT NULL,
        summary TEXT NOT NULL,
        source TEXT NOT NULL,
        url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    kb_path = os.path.join(os.path.dirname(__file__), "..", "app", "knowledge_base.json")
    with open(kb_path, "r", encoding="utf-8") as f:
        entries = json.load(f)

    for item in entries:
        cur.execute("""
        INSERT OR REPLACE INTO quantum_knowledge_base (id, topic, title, tags, summary, source, url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            item["id"],
            item["topic"],
            item["title"],
            json.dumps(item.get("tags", [])),
            item["summary"],
            item.get("source", ""),
            item.get("url", "")
        ))

    conn.commit()
    cur.execute("SELECT COUNT(*) FROM quantum_knowledge_base;")
    count = cur.fetchone()[0]
    conn.close()
    print(f"[+] Local SQLite cache initialized with {count} records at {db_path}")

if __name__ == "__main__":
    env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
    load_env(env_file)
    print("=" * 60)
    print("SETTING UP QUANTUM KNOWLEDGE BASE DATABASE")
    print("=" * 60)
    supabase_ok = setup_supabase_postgres()
    setup_local_sqlite_cache()
    if supabase_ok:
        print("\n>>> DATABASE SETUP SUCCESSFUL: Supabase PostgreSQL is live & seeded!")
    else:
        print("\n>>> DATABASE SETUP COMPLETED with local resilient cache.")
