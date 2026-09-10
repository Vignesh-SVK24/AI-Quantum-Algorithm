"""
Quantum Knowledge Ingestion System
Smart India Hackathon — Interactive Quantum Algorithm Learning Platform

This package implements Stage 1 of the two-stage knowledge architecture:
  Stage 1 (this package): External sources → collect → verify → stage → admin approve → Supabase
  Stage 2 (backend/app/services/local_search.py): Supabase → SQLite → student Search Bar

ARCHITECTURAL GUARANTEE:
  Nothing in this package is importable from FastAPI routes in backend/app/main.py.
  This pipeline runs offline, admin/dev-side only, never at student request time.
"""
