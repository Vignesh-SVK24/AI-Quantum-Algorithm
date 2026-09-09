"""
Research Router & Autonomous Decision Engine for Quantum AI Tutor.
Classifies student queries into internal vs external research intents.
"""

import re
from dataclasses import dataclass
from typing import Literal

class ResearchCategory:
    INTERNAL_KNOWLEDGE = "INTERNAL_KNOWLEDGE"
    WEB_RESEARCH_REQUIRED = "WEB_RESEARCH_REQUIRED"
    QUANTUM_DOCUMENTATION_RESEARCH = "QUANTUM_DOCUMENTATION_RESEARCH"
    ACADEMIC_RESEARCH = "ACADEMIC_RESEARCH"
    CURRENT_INFORMATION = "CURRENT_INFORMATION"
    HYBRID = "HYBRID"

@dataclass
class ResearchIntent:
    category: str
    should_search_web: bool
    reasoning: str
    search_domains: list[str]
    include_internal_knowledge: bool

def route_research_intent(query: str, has_high_confidence_kb_match: bool = False) -> ResearchIntent:
    category, should_search, reasoning = analyze_research_decision(query, has_high_confidence_kb_match)
    domains = ["arxiv.org", "quantum-journal.org"] if category == ResearchCategory.ACADEMIC_RESEARCH else ["ibm.com", "quantumai.google"]
    include_internal = category in (ResearchCategory.INTERNAL_KNOWLEDGE, ResearchCategory.HYBRID)
    return ResearchIntent(
        category=category,
        should_search_web=should_search,
        reasoning=reasoning,
        search_domains=domains,
        include_internal_knowledge=include_internal
    )

TEMPORAL_PATTERNS = [
    r"\b(latest|recent|recently|today|current|currently|newest|2024|2025|2026)\b",
    r"\b(recent\s+research|recent\s+paper|recent\s+papers|recent\s+publication|recent\s+publications)\b",
    r"\b(current\s+ibm|current\s+google|current\s+aws|current\s+microsoft)\b",
    r"\b(recent\s+quantum\s+hardware|current\s+quantum\s+processor|latest\s+quantum\s+processor)\b",
    r"\b(latest\s+quantum\s+algorithms?|latest\s+quantum\s+error\s+correction)\b",
    r"\b(latest\s+benchmarks?|recent\s+announcements?|breakthroughs?)\b",
    r"\b(state\s+of\s+the\s+art|sota)\b"
]

ACADEMIC_PATTERNS = [
    r"\b(arxiv|paper|papers|journal|conference|published|publication|publications)\b",
    r"\b(nature|science|physical\s+review|phys\s+rev|ieee|acm|author|authors)\b",
    r"\b(variational\s+quantum\s+eigensolver\s+papers?|vqe\s+papers?|qaoa\s+papers?)\b",
    r"\b(quantum\s+chemistry\s+papers?|fault\s+tolerant\s+threshold\s+proof)\b",
    r"\b(peer\s+reviewed|literature\s+review|citations?)\b"
]

VENDOR_DOC_PATTERNS = [
    r"\b(heron|condor|eagle|osprey|system\s+two|system\s+one)\b", # IBM processors
    r"\b(willow|sycamore|foxtail|bristlecone)\b", # Google processors
    r"\b(cuda-q|cuquantum)\b", # NVIDIA
    r"\b(h1|h2|helios)\b", # Quantinuum
    r"\b(forte|aria|harmony)\b", # IonQ
    r"\b(ankaa|aspen)\b", # Rigetti
    r"\b(advantage|advantage2)\b", # D-Wave
    r"\b(braket|azure\s+quantum|qiskit\s+runtime)\b",
    r"\b(topological\s+qubit|majorana\s+zero\s+mode)\b"
]

INDUSTRY_PATTERNS = [
    r"\b(companies|startups|commercial|industry|market|funding|roadmap|consortium)\b",
    r"\b(who\s+is\s+building|who\s+leads|commercialization)\b"
]

# Foundational quantum concepts fully covered by the platform's internal knowledge base
FOUNDATIONAL_CONCEPTS = [
    "qubit", "superposition", "hadamard", "pauli", "cnot", "bloch", "measurement",
    "born rule", "amplitude", "statevector", "phase", "bell state", "entanglement",
    "deutsch-jozsa", "deutsch jozsa", "grover", "grover's", "shor", "shor's",
    "dirac", "bra-ket", "unitary", "computational basis", "teleportation"
]

def analyze_research_decision(query: str, has_high_confidence_kb_match: bool = False) -> tuple[ResearchCategory, bool, str]:
    """
    Decides whether web research is necessary and what category of research to conduct.
    
    Returns:
        (category, requires_web_search, reasoning)
    """
    q_lower = query.lower().strip()
    
    # 1. Check for temporal/recent cues
    has_temporal = any(re.search(pat, q_lower) for pat in TEMPORAL_PATTERNS)
    
    # 2. Check for academic research cues
    has_academic = any(re.search(pat, q_lower) for pat in ACADEMIC_PATTERNS)
    
    # 3. Check for specific vendor hardware/docs cues
    has_vendor = any(re.search(pat, q_lower) for pat in VENDOR_DOC_PATTERNS)
    
    # 4. Check for industry/commercial cues
    has_industry = any(re.search(pat, q_lower) for pat in INDUSTRY_PATTERNS)
    
    # 5. Check for foundational platform concepts
    matches_foundational = any(c in q_lower for c in FOUNDATIONAL_CONCEPTS)
    
    # --- Decision Tree ---
    
    # A. Hybrid: Foundational concept mentioned alongside temporal or recent developments
    if matches_foundational and (has_temporal or "latest" in q_lower or "recent" in q_lower):
        return (
            "HYBRID",
            True,
            "Combines foundational quantum concept with recent developments or 2026 temporal indicators."
        )
        
    # B. Academic research query
    if has_academic:
        return (
            "ACADEMIC_RESEARCH",
            True,
            "Involves academic publications, arXiv preprints, journal articles, or theoretical literature."
        )
        
    # C. Vendor hardware or architecture query
    if has_vendor:
        return (
            "QUANTUM_DOCUMENTATION_RESEARCH",
            True,
            "Queries specific modern quantum processor architectures, vendor SDKs, or hardware roadmaps."
        )
        
    # D. Industry / Commercial landscape
    if has_industry or "who is building" in q_lower:
        return (
            "CURRENT_INFORMATION",
            True,
            "Inquires about commercial organizations, industry roadmaps, or market developments."
        )
        
    # E. General temporal query
    if has_temporal:
        return (
            "WEB_RESEARCH_REQUIRED",
            True,
            "Requires current or recently announced quantum computing developments."
        )
        
    # F. Foundational educational concept with platform KB coverage
    if matches_foundational or has_high_confidence_kb_match:
        return (
            "INTERNAL_KNOWLEDGE",
            False,
            "Stable foundational quantum concept fully covered by platform's verified curriculum."
        )
        
    # G. Fallback: If not foundational and not explicitly covered, trigger web research
    return (
        "WEB_RESEARCH_REQUIRED",
        True,
        "Query extends beyond core educational curriculum; external verification needed."
    )
