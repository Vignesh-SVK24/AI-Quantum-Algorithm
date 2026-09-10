-- Migration 005: Create Practice System Tables
-- Supporting 3-level progressive learning system with topic-grounded questions

CREATE TABLE IF NOT EXISTS practice_questions (
    id INTEGER PRIMARY KEY,
    topic_id TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    question TEXT NOT NULL,
    question_type TEXT NOT NULL, -- 'multiple_choice', 'true_false', 'predict', 'calculation', 'circuit'
    options TEXT NOT NULL,       -- JSON array of strings
    correct_answer INTEGER NOT NULL, -- 0-based index
    explanation TEXT NOT NULL,
    difficulty TEXT NOT NULL,    -- 'beginner', 'intermediate', 'advanced'
    level TEXT NOT NULL,         -- 'beginner', 'intermediate', 'advanced'
    round INTEGER NOT NULL,      -- 1, 2, 3
    source_content_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_practice_questions_level_round ON practice_questions (level, round);
CREATE INDEX IF NOT EXISTS idx_practice_questions_topic ON practice_questions (topic_id);

CREATE TABLE IF NOT EXISTS practice_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    question_id INTEGER NOT NULL,
    topic_id TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    selected_option INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES practice_questions (id)
);

CREATE INDEX IF NOT EXISTS idx_practice_attempts_user ON practice_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_practice_attempts_topic ON practice_attempts (topic_id);

CREATE TABLE IF NOT EXISTS practice_progress (
    user_id TEXT PRIMARY KEY,
    current_level TEXT NOT NULL DEFAULT 'beginner',
    current_round INTEGER NOT NULL DEFAULT 1,
    unlocked_levels TEXT NOT NULL DEFAULT '["beginner"]',
    completed_levels TEXT NOT NULL DEFAULT '[]',
    unlocked_rounds TEXT NOT NULL DEFAULT '{"beginner": 1}',
    round_scores TEXT NOT NULL DEFAULT '{}',
    topic_stats TEXT NOT NULL DEFAULT '{}',
    learned_topics TEXT NOT NULL DEFAULT '[]',
    weak_topics TEXT NOT NULL DEFAULT '[]',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
