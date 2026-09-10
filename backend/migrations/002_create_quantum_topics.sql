-- =========================================================================
-- Migration: 002_create_quantum_topics.sql
-- Table: quantum_topics
-- Smart India Hackathon - Interactive Quantum Algorithm Learning Platform
-- Quantum Encyclopedia Database Engine
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.quantum_topics (
    id TEXT PRIMARY KEY,
    topic_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    short_definition TEXT NOT NULL,
    beginner_explanation TEXT NOT NULL,
    detailed_explanation TEXT NOT NULL,
    mathematical_explanation TEXT,
    formula TEXT,
    example TEXT,
    circuit_example TEXT,
    related_topics TEXT[] NOT NULL DEFAULT '{}',
    common_mistakes TEXT[] NOT NULL DEFAULT '{}',
    aliases TEXT[] NOT NULL DEFAULT '{}',
    keywords TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    source_name VARCHAR(255),
    source_url TEXT,
    additional_sources JSONB DEFAULT '[]'::jsonb,
    verification_status VARCHAR(50) DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-Text Search GIN Index on topic_name, short_definition, and detailed_explanation (IMMUTABLE)
CREATE INDEX IF NOT EXISTS idx_qt_fts ON public.quantum_topics 
USING gin(to_tsvector('english', topic_name || ' ' || short_definition || ' ' || detailed_explanation));

-- GIN Indexes on array fields for fast containment/overlap searching
CREATE INDEX IF NOT EXISTS idx_qt_aliases ON public.quantum_topics USING gin(aliases);
CREATE INDEX IF NOT EXISTS idx_qt_tags ON public.quantum_topics USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_qt_keywords ON public.quantum_topics USING gin(keywords);
CREATE INDEX IF NOT EXISTS idx_qt_category ON public.quantum_topics(category);

-- Enable Row Level Security (RLS) for public read access
ALTER TABLE public.quantum_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on quantum_topics" 
ON public.quantum_topics 
FOR SELECT 
USING (true);

-- Allow service_role full access for seeding and updates
CREATE POLICY "Allow service_role full access on quantum_topics" 
ON public.quantum_topics 
FOR ALL 
USING (true);
