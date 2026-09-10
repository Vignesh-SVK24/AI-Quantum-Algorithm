import json
import os
import sqlite3
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

practice_router = APIRouter(prefix="/practice", tags=["Practice"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "quantum_topics.sqlite3")
JSON_PATH = os.path.join(BASE_DIR, "data", "practice_questions.json")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def load_fallback_questions():
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


class PracticeAnswer(BaseModel):
    question_id: int
    selected_option: int
    is_correct: bool
    topic_id: str


class SubmitRoundRequest(BaseModel):
    user_id: str = "anonymous"
    level: str  # 'beginner', 'intermediate', 'advanced'
    round: int  # 1, 2, 3
    answers: List[PracticeAnswer]


@practice_router.get("/questions")
async def get_practice_questions(
    level: str = Query("beginner", pattern="^(beginner|intermediate|advanced)$"),
    round: int = Query(1, ge=1, le=3),
    user_id: Optional[str] = "anonymous",
    learned_only: bool = False,
    topics: Optional[str] = None  # comma-separated list of learned topics
):
    """
    Fetch 10 practice questions for the specified level and round.
    If user_id or topics are provided, questions are filtered/prioritized based on
    learned topics and weighted toward weak topics.
    """
    questions = []
    user_weak_topics = set()
    user_learned_topics = set()

    if topics:
        user_learned_topics = {t.strip().lower() for t in topics.split(",") if t.strip()}

    # Try querying SQLite database
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Check user's weak topics from DB if user_id given
        if user_id and user_id != "anonymous":
            cur.execute("SELECT weak_topics, learned_topics FROM practice_progress WHERE user_id = ?", (user_id,))
            row = cur.fetchone()
            if row:
                if row["weak_topics"]:
                    try:
                        user_weak_topics = set(json.loads(row["weak_topics"]))
                    except Exception:
                        pass
                if not user_learned_topics and row["learned_topics"]:
                    try:
                        user_learned_topics = set(json.loads(row["learned_topics"]))
                    except Exception:
                        pass

        cur.execute(
            """
            SELECT id, topic_id, topic_name, question, question_type, options,
                   correct_answer, explanation, difficulty, level, round, source_content_id
            FROM practice_questions
            WHERE level = ? AND round = ?
            ORDER BY id ASC
            """,
            (level.lower(), round)
        )
        rows = cur.fetchall()
        for r in rows:
            questions.append({
                "id": r["id"],
                "topic_id": r["topic_id"],
                "topic_name": r["topic_name"],
                "question": r["question"],
                "question_type": r["question_type"],
                "options": json.loads(r["options"]),
                "correct_answer": r["correct_answer"],
                "explanation": r["explanation"],
                "difficulty": r["difficulty"],
                "level": r["level"],
                "round": r["round"],
                "source_content_id": r["source_content_id"]
            })
        conn.close()
    except Exception:
        # Fallback to JSON file
        all_q = load_fallback_questions()
        questions = [
            q for q in all_q
            if q["level"].lower() == level.lower() and q["round"] == round
        ]

    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for requested level and round.")

    # Filter by learned topics if requested (Step 4 & Step 12 Test 6)
    if user_learned_topics:
        learned_qs = [q for q in questions if q["topic_id"].lower() in user_learned_topics]
        if len(learned_qs) > 0:
            # Prioritize learned topics; fill with remaining if learned_only is False
            if learned_only:
                questions = learned_qs
            else:
                other_qs = [q for q in questions if q["topic_id"].lower() not in user_learned_topics]
                questions = (learned_qs + other_qs)[:10]

    # Weight weak topics to the front (Step 9 & Step 12 Test 7)
    if user_weak_topics:
        weak_qs = [q for q in questions if q["topic_id"].lower() in user_weak_topics]
        strong_qs = [q for q in questions if q["topic_id"].lower() not in user_weak_topics]
        questions = weak_qs + strong_qs

    return {
        "level": level,
        "round": round,
        "count": len(questions[:10]),
        "questions": questions[:10]
    }


@practice_router.post("/submit")
async def submit_practice_round(payload: SubmitRoundRequest):
    """
    Process round submission, calculate score, evaluate 70% threshold,
    log attempts into practice_attempts, and update practice_progress.
    """
    total = len(payload.answers)
    if total == 0:
        raise HTTPException(status_code=400, detail="No answers provided in submission.")

    score = sum(1 for a in payload.answers if a.is_correct)
    passed = (score / total) >= 0.7  # 70% threshold

    # Update SQLite database if accessible
    new_round_unlocked = None
    new_level_unlocked = None
    strong_topics = []
    weak_topics = []

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1. Log attempts
        for ans in payload.answers:
            cur.execute(
                """
                INSERT INTO practice_attempts (user_id, question_id, topic_id, is_correct, selected_option)
                VALUES (?, ?, ?, ?, ?)
                """,
                (payload.user_id, ans.question_id, ans.topic_id, ans.is_correct, ans.selected_option)
            )

        # 2. Fetch or initialize progress
        cur.execute("SELECT * FROM practice_progress WHERE user_id = ?", (payload.user_id,))
        prog_row = cur.fetchone()

        if prog_row:
            unlocked_levels = json.loads(prog_row["unlocked_levels"] or '["beginner"]')
            completed_levels = json.loads(prog_row["completed_levels"] or '[]')
            unlocked_rounds = json.loads(prog_row["unlocked_rounds"] or '{"beginner": 1}')
            round_scores = json.loads(prog_row["round_scores"] or '{}')
            topic_stats = json.loads(prog_row["topic_stats"] or '{}')
            learned_topics = json.loads(prog_row["learned_topics"] or '[]')
        else:
            unlocked_levels = ["beginner"]
            completed_levels = []
            unlocked_rounds = {"beginner": 1, "intermediate": 1, "advanced": 1}
            round_scores = {}
            topic_stats = {}
            learned_topics = ["qubit", "superposition", "measurement", "bloch-sphere"]

        # Update round scores
        round_key = f"{payload.level}-{payload.round}"
        round_scores[round_key] = {
            "score": score,
            "total": total,
            "passed": passed
        }

        # Update topic stats
        for ans in payload.answers:
            t_id = ans.topic_id
            if t_id not in topic_stats:
                topic_stats[t_id] = {"attempted": 0, "correct": 0}
            topic_stats[t_id]["attempted"] += 1
            if ans.is_correct:
                topic_stats[t_id]["correct"] += 1

            if t_id not in learned_topics:
                learned_topics.append(t_id)

        # Compute weak & strong topics
        for t_id, stat in topic_stats.items():
            if stat["attempted"] >= 1:
                acc = stat["correct"] / stat["attempted"]
                if acc < 0.7:
                    weak_topics.append(t_id)
                elif acc >= 0.8 and stat["attempted"] >= 2:
                    strong_topics.append(t_id)

        # Handle unlocks
        if passed:
            lvl_key = payload.level.lower()
            current_r = unlocked_rounds.get(lvl_key, 1)
            if payload.round < 3:
                next_r = payload.round + 1
                if next_r > current_r:
                    unlocked_rounds[lvl_key] = next_r
                new_round_unlocked = next_r
            elif payload.round == 3:
                if lvl_key not in completed_levels:
                    completed_levels.append(lvl_key)
                if lvl_key == "beginner":
                    if "intermediate" not in unlocked_levels:
                        unlocked_levels.append("intermediate")
                    unlocked_rounds["intermediate"] = max(1, unlocked_rounds.get("intermediate", 1))
                    new_level_unlocked = "intermediate"
                elif lvl_key == "intermediate":
                    if "advanced" not in unlocked_levels:
                        unlocked_levels.append("advanced")
                    unlocked_rounds["advanced"] = max(1, unlocked_rounds.get("advanced", 1))
                    new_level_unlocked = "advanced"

        # Upsert progress
        cur.execute(
            """
            INSERT INTO practice_progress (
                user_id, current_level, current_round, unlocked_levels,
                completed_levels, unlocked_rounds, round_scores, topic_stats,
                learned_topics, weak_topics
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                current_level = excluded.current_level,
                current_round = excluded.current_round,
                unlocked_levels = excluded.unlocked_levels,
                completed_levels = excluded.completed_levels,
                unlocked_rounds = excluded.unlocked_rounds,
                round_scores = excluded.round_scores,
                topic_stats = excluded.topic_stats,
                learned_topics = excluded.learned_topics,
                weak_topics = excluded.weak_topics,
                updated_at = CURRENT_TIMESTAMP
            """,
            (
                payload.user_id,
                payload.level,
                payload.round,
                json.dumps(unlocked_levels),
                json.dumps(completed_levels),
                json.dumps(unlocked_rounds),
                json.dumps(round_scores),
                json.dumps(topic_stats),
                json.dumps(learned_topics),
                json.dumps(weak_topics)
            )
        )
        conn.commit()
        conn.close()

    except Exception as e:
        # Fallback in-memory logic
        if passed:
            if payload.round < 3:
                new_round_unlocked = payload.round + 1
            else:
                if payload.level == "beginner":
                    new_level_unlocked = "intermediate"
                elif payload.level == "intermediate":
                    new_level_unlocked = "advanced"

    return {
        "passed": passed,
        "score": score,
        "total": total,
        "percentage": round((score / total) * 100),
        "threshold": 70,
        "new_round_unlocked": new_round_unlocked,
        "new_level_unlocked": new_level_unlocked,
        "weak_topics": weak_topics,
        "strong_topics": strong_topics
    }


@practice_router.get("/progress/{user_id}")
async def get_user_progress(user_id: str):
    """
    Retrieve persisted practice progress for a given user.
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM practice_progress WHERE user_id = ?", (user_id,))
        row = cur.fetchone()
        conn.close()

        if not row:
            return {
                "user_id": user_id,
                "current_level": "beginner",
                "current_round": 1,
                "unlocked_levels": ["beginner"],
                "completed_levels": [],
                "unlocked_rounds": {"beginner": 1, "intermediate": 1, "advanced": 1},
                "round_scores": {},
                "topic_stats": {},
                "weak_topics": [],
                "strong_topics": []
            }

        return {
            "user_id": row["user_id"],
            "current_level": row["current_level"],
            "current_round": row["current_round"],
            "unlocked_levels": json.loads(row["unlocked_levels"] or '["beginner"]'),
            "completed_levels": json.loads(row["completed_levels"] or '[]'),
            "unlocked_rounds": json.loads(row["unlocked_rounds"] or '{"beginner": 1}'),
            "round_scores": json.loads(row["round_scores"] or '{}'),
            "topic_stats": json.loads(row["topic_stats"] or '{}'),
            "weak_topics": json.loads(row["weak_topics"] or '[]'),
            "learned_topics": json.loads(row["learned_topics"] or '[]')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
