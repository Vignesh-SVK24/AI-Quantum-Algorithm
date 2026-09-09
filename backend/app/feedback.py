import os
import json
import time
import logging
from pydantic import BaseModel
from typing import Optional

logger = logging.getLogger("feedback_store")

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
FEEDBACK_FILE = os.path.join(DATA_DIR, "feedback.jsonl")

class FeedbackPayload(BaseModel):
    message_id: str
    question: str
    response: str
    mode: str = "beginner"
    rating: int  # 1 for thumbs up, -1 for thumbs down
    sources_cited: list[dict] = []
    feedback_text: Optional[str] = None
    timestamp: Optional[float] = None

def ensure_data_dir():
    os.makedirs(DATA_DIR, exist_ok=True)

def record_feedback(payload: FeedbackPayload) -> dict:
    ensure_data_dir()
    entry = payload.dict()
    if not entry.get("timestamp"):
        entry["timestamp"] = time.time()
    entry["iso_time"] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(entry["timestamp"]))
    
    try:
        with open(FEEDBACK_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")
        logger.info(f"Recorded feedback: {payload.rating} for question '{payload.question[:40]}...'")
        return {"status": "success", "message": "Feedback recorded successfully."}
    except Exception as e:
        logger.error(f"Failed to record feedback: {e}")
        return {"status": "error", "message": str(e)}

def get_feedback_summary() -> dict:
    ensure_data_dir()
    if not os.path.exists(FEEDBACK_FILE):
        return {
            "total_ratings": 0,
            "positive_count": 0,
            "negative_count": 0,
            "positive_percentage": 100.0,
            "by_mode": {"beginner": 0, "intermediate": 0, "advanced": 0},
            "recent_feedbacks": []
        }

    total = 0
    pos = 0
    neg = 0
    by_mode = {"beginner": 0, "intermediate": 0, "advanced": 0}
    recent = []

    try:
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                    total += 1
                    rating = entry.get("rating", 1)
                    if rating > 0:
                        pos += 1
                    else:
                        neg += 1
                    mode = entry.get("mode", "beginner")
                    by_mode[mode] = by_mode.get(mode, 0) + 1
                    recent.append({
                        "question": entry.get("question", "")[:60],
                        "mode": mode,
                        "rating": rating,
                        "iso_time": entry.get("iso_time", "")
                    })
                except Exception:
                    continue
    except Exception as e:
        logger.error(f"Failed to read feedback: {e}")

    pct = round((pos / total * 100), 1) if total > 0 else 100.0
    return {
        "total_ratings": total,
        "positive_count": pos,
        "negative_count": neg,
        "positive_percentage": pct,
        "by_mode": by_mode,
        "recent_feedbacks": recent[-10:]
    }
