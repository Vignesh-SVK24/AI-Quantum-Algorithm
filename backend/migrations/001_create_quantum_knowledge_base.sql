-- =========================================================================
-- Migration: 001_create_quantum_knowledge_base.sql
-- Table: quantum_knowledge_base
-- Smart India Hackathon - Interactive Quantum Algorithm Learning Platform
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.quantum_knowledge_base (
    id TEXT PRIMARY KEY,
    topic VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    tags TEXT[] NOT NULL,
    summary TEXT NOT NULL,
    source VARCHAR(255) NOT NULL,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-Text Search GIN Index on title and summary (IMMUTABLE)
CREATE INDEX IF NOT EXISTS idx_qkb_fts ON public.quantum_knowledge_base 
USING gin(to_tsvector('english', title || ' ' || summary));

-- Native GIN Index on tags array (IMMUTABLE)
CREATE INDEX IF NOT EXISTS idx_qkb_tags ON public.quantum_knowledge_base 
USING gin(tags);

-- Enable Row Level Security (RLS) for public read access
ALTER TABLE public.quantum_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON public.quantum_knowledge_base 
FOR SELECT 
USING (true);

-- Allow authenticated/service_role full access for seeding and updates
CREATE POLICY "Allow service_role full access" 
ON public.quantum_knowledge_base 
FOR ALL 
USING (true);
