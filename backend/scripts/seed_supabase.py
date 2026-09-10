"""
Seed Quantum Knowledge Base into Supabase via official REST client
"""

import os
import sys
import json
from supabase import create_client

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.stdout.reconfigure(encoding="utf-8")

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip())

def seed_supabase():
    load_env()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")

    if not url or not key:
        print("[!] Missing SUPABASE_URL or SUPABASE_KEY in .env")
        return False

    client = create_client(url, key)
    kb_path = os.path.join(os.path.dirname(__file__), "..", "app", "knowledge_base.json")
    with open(kb_path, "r", encoding="utf-8") as f:
        entries = json.load(f)

    print(f"[*] Seeding {len(entries)} quantum entries into Supabase...")
    success_count = 0
    for item in entries:
        try:
            payload = {
                "id": item["id"],
                "topic": item["topic"],
                "title": item["title"],
                "tags": item.get("tags", []),
                "summary": item["summary"],
                "source": item.get("source", ""),
                "url": item.get("url", "")
            }
            client.table("quantum_knowledge_base").upsert(payload).execute()
            success_count += 1
        except Exception as e:
            print(f"[!] Error upserting {item['id']}: {e}")

    print(f"[+] Successfully seeded {success_count}/{len(entries)} entries into Supabase!")
    return success_count > 0

if __name__ == "__main__":
    seed_supabase()
