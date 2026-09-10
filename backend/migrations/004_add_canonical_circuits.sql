-- Migration 004: Add canonical_circuit column to quantum_topics
-- Smart India Hackathon — Interactive Quantum Algorithm Learning Platform
--
-- Adds canonical_circuit JSONB column for topics that have a representative
-- circuit that can be simulated deterministically and visualized in 3D.
-- Purely conceptual topics without a canonical circuit remain NULL.

ALTER TABLE public.quantum_topics
    ADD COLUMN IF NOT EXISTS canonical_circuit JSONB;

COMMENT ON COLUMN public.quantum_topics.canonical_circuit IS
    'Structured circuit definition {num_qubits, gates} for deterministic Qiskit simulation and 3D visual rendering.';
