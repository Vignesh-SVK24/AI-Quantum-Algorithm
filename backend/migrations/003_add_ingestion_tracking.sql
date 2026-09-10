-- =========================================================================
-- Migration: 003_add_ingestion_tracking.sql
-- Smart India Hackathon — Quantum Knowledge Ingestion System
-- Stage 1 admin pipeline schema extensions
-- =========================================================================
-- SAFETY: All new quantum_topics columns are NULLABLE with sensible defaults.
-- The Search Bar SELECT queries are unaffected.
-- =========================================================================

-- ── 1. Extend quantum_topics with ingestion tracking columns ─────────────

ALTER TABLE public.quantum_topics
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'approved',
    ADD COLUMN IF NOT EXISTS knowledge_version INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS verification_notes TEXT,
    ADD COLUMN IF NOT EXISTS ingestion_source_id TEXT,
    ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(20),
    ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100);

-- Index for admin filtering by status
CREATE INDEX IF NOT EXISTS idx_qt_status ON public.quantum_topics(status);

-- ── 2. Authoritative Source Registry ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.knowledge_sources (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    base_url TEXT NOT NULL,
    trust_level INTEGER NOT NULL DEFAULT 1 CHECK (trust_level BETWEEN 1 AND 3),
    topics_covered TEXT[] NOT NULL DEFAULT '{}',
    fetch_delay_ms INTEGER NOT NULL DEFAULT 1500,
    robots_txt_checked_at TIMESTAMPTZ,
    enabled BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the initial source registry
INSERT INTO public.knowledge_sources (id, name, base_url, trust_level, topics_covered, fetch_delay_ms, notes)
VALUES
    ('ibm-quantum-learning', 'IBM Quantum Learning', 'https://learning.quantum.ibm.com', 1,
     ARRAY['qubit','superposition','measurement','quantum-entanglement','bell-state','quantum-interference'], 1500,
     'Primary authoritative source for foundational quantum concepts'),
    ('qiskit-textbook', 'Qiskit Textbook (learn.qiskit.org)', 'https://learn.qiskit.org', 1,
     ARRAY['hadamard-gate','cnot-gate','x-gate','y-gate','z-gate','grovers-algorithm','quantum-fourier-transform','phase-kickback','deutsch-jozsa-algorithm'], 1500,
     'Qiskit official learning resource with circuit examples'),
    ('nist-quantum-glossary', 'NIST Quantum Information Glossary', 'https://csrc.nist.gov/glossary', 1,
     ARRAY['qubit','quantum-entanglement','superposition'], 2000,
     'US federal standards body; highest authoritative weight'),
    ('quantum-computing-stackexchange', 'Quantum Computing Stack Exchange', 'https://quantumcomputing.stackexchange.com', 2,
     ARRAY[], 2000,
     'Community-verified Q&A; trust level 2 — requires human review'),
    ('arxiv-quantum-physics', 'arXiv Quantum Physics (quant-ph)', 'https://arxiv.org/list/quant-ph', 2,
     ARRAY[], 3000,
     'Preprint server; use only for algorithm-level content, requires expert review')
ON CONFLICT (id) DO NOTHING;

-- RLS for knowledge_sources (admin-only write, no public read needed)
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Service role full access on knowledge_sources"
ON public.knowledge_sources FOR ALL USING (true);

-- ── 3. Ingestion Job Audit Log ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.knowledge_ingestion_jobs (
    id TEXT PRIMARY KEY,
    source_id TEXT REFERENCES public.knowledge_sources(id),
    target_topic_slug TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending_review'
        CHECK (status IN ('pending_review', 'approved', 'rejected', 'published', 'failed')),
    raw_content TEXT,
    parsed_fields JSONB,
    quality_score REAL CHECK (quality_score BETWEEN 0.0 AND 1.0),
    quality_report JSONB,
    admin_notes TEXT,
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ
);

-- Indexes for admin workflows
CREATE INDEX IF NOT EXISTS idx_kij_status ON public.knowledge_ingestion_jobs(status);
CREATE INDEX IF NOT EXISTS idx_kij_topic ON public.knowledge_ingestion_jobs(target_topic_slug);
CREATE INDEX IF NOT EXISTS idx_kij_submitted ON public.knowledge_ingestion_jobs(submitted_at DESC);

-- RLS (admin/service role only)
ALTER TABLE public.knowledge_ingestion_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Service role full access on knowledge_ingestion_jobs"
ON public.knowledge_ingestion_jobs FOR ALL USING (true);
