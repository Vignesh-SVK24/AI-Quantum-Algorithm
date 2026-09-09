"""
Model Context Protocol (MCP) Server Definition for Tavily Quantum Research.
Exposes standard MCP tool interfaces for autonomous quantum web research.
"""

from app.services.tavily_search import search_tavily
from app.services.source_ranker import rank_and_verify_sources

MCP_TOOL_DEFINITION = {
    "name": "tavily_quantum_research",
    "description": (
        "Autonomously searches authoritative quantum computing web sources, arXiv preprints, "
        "and vendor documentation (IBM, Google, Nature, Qiskit) using Tavily."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Specific quantum computing research query"
            },
            "category": {
                "type": "string",
                "enum": [
                    "INTERNAL_KNOWLEDGE",
                    "WEB_RESEARCH_REQUIRED",
                    "QUANTUM_DOCUMENTATION_RESEARCH",
                    "ACADEMIC_RESEARCH",
                    "CURRENT_INFORMATION",
                    "HYBRID"
                ],
                "description": "Research category detected by router"
            },
            "max_results": {
                "type": "integer",
                "default": 4,
                "description": "Maximum authoritative sources to retrieve"
            }
        },
        "required": ["query"]
    }
}

def execute_mcp_tool(name: str, arguments: dict) -> dict:
    """Executes MCP tool call."""
    if name != "tavily_quantum_research":
        return {"error": f"Unknown tool: {name}"}
        
    query = arguments.get("query", "")
    category = arguments.get("category", "WEB_RESEARCH_REQUIRED")
    max_results = arguments.get("max_results", 4)
    
    raw_response = search_tavily(query, category=category, max_results=max_results)
    ranked = rank_and_verify_sources(raw_response.get("results", []), max_sources=max_results)
    
    return {
        "tool": "tavily_quantum_research",
        "provider": raw_response.get("search_provider"),
        "is_fallback": raw_response.get("is_fallback", False),
        "results": ranked
    }
