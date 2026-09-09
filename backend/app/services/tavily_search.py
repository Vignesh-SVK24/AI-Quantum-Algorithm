"""
Tavily Search Engine & Fallback Retrieval Client for Quantum Research Agent.
Supports official Tavily Search API with advanced depth, query expansion,
quantum-specific domain targeting, and academic arXiv/Wikipedia fallback.
"""

import os
import re
import json
import logging
import urllib.request
import urllib.parse
from typing import TypedDict

logger = logging.getLogger("tavily_search")

class WebSearchResult(TypedDict):
    title: str
    url: str
    content: str
    score: float
    domain: str
    source_type: str # 'web', 'academic', 'documentation'

class TavilySearchResponse(TypedDict):
    query: str
    search_provider: str # 'tavily' or 'academic_fallback'
    answer: str | None
    results: list[WebSearchResult]
    is_fallback: bool

# Authoritative Quantum Domains
QUANTUM_DOMAINS = [
    "ibm.com", "research.ibm.com", "quantumai.google", "azure.microsoft.com",
    "aws.amazon.com", "nvidia.com", "quantinuum.com", "ionq.com", "rigetti.com",
    "dwavesys.com", "arxiv.org", "nature.com", "science.org", "aps.org",
    "ieee.org", "acm.org", "qiskit.org", "pennylane.ai"
]

def expand_quantum_query(query: str, category: str) -> str:
    """Expands student query with quantum context tailored to research category."""
    clean_q = re.sub(r'[^\w\s\-\.\+\|]', ' ', query).strip()
    
    if category == "ACADEMIC_RESEARCH":
        if not any(k in clean_q.lower() for k in ["arxiv", "paper", "research", "journal"]):
            return f"{clean_q} quantum research paper arXiv"
        return clean_q
        
    if category == "QUANTUM_DOCUMENTATION_RESEARCH":
        if not any(k in clean_q.lower() for k in ["quantum", "processor", "architecture", "sdk"]):
            return f"{clean_q} quantum processor architecture documentation"
        return clean_q
        
    if category == "WEB_RESEARCH_REQUIRED" or category == "CURRENT_INFORMATION":
        if "quantum" not in clean_q.lower():
            return f"quantum computing {clean_q}"
        return clean_q
        
    if category == "HYBRID":
        return f"quantum computing {clean_q} research developments"
        
    return clean_q


def search_tavily(
    query: str, 
    category: str = "WEB_RESEARCH_REQUIRED",
    max_results: int = 5
) -> TavilySearchResponse:
    """
    Executes search via Tavily API if TAVILY_API_KEY is configured.
    Falls back gracefully to academic endpoints if key is missing or call fails.
    """
    api_key = os.environ.get("TAVILY_API_KEY", "").strip()
    expanded_query = expand_quantum_query(query, category)
    
    # 1. Attempt Tavily Search API
    if api_key and api_key != "your_tavily_api_key_here":
        try:
            url = "https://api.tavily.com/search"
            payload = {
                "api_key": api_key,
                "query": expanded_query,
                "search_depth": "advanced",
                "include_answer": True,
                "include_raw_content": False,
                "max_results": max_results,
                "include_domains": QUANTUM_DOMAINS if category in ("QUANTUM_DOCUMENTATION_RESEARCH", "ACADEMIC_RESEARCH") else []
            }
            data_bytes = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                url,
                data=data_bytes,
                headers={"Content-Type": "application/json", "User-Agent": "QuantumTutor/2.0"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                raw_results = data.get("results", [])
                parsed_results: list[WebSearchResult] = []
                for item in raw_results:
                    u = item.get("url", "")
                    parsed_domain = urllib.parse.urlparse(u).netloc
                    parsed_results.append({
                        "title": item.get("title", ""),
                        "url": u,
                        "content": item.get("content", ""),
                        "score": float(item.get("score", 0.7)),
                        "domain": parsed_domain,
                        "source_type": "academic" if "arxiv" in parsed_domain or "nature" in parsed_domain else "web"
                    })
                logger.info(f"Tavily returned {len(parsed_results)} results for '{expanded_query}'")
                return {
                    "query": query,
                    "search_provider": "tavily",
                    "answer": data.get("answer"),
                    "results": parsed_results,
                    "is_fallback": False
                }
        except Exception as e:
            logger.warning(f"Tavily API call failed ({e}). Falling back to academic/web retrieval.")

    # 2. Resilient Fallback: arXiv & Wikipedia Quantum Search
    return search_academic_fallback(query, category, max_results=max_results)


def search_academic_fallback(
    query: str, 
    category: str = "WEB_RESEARCH_REQUIRED",
    max_results: int = 4
) -> TavilySearchResponse:
    """
    Zero-credential academic fallback using arXiv API and Wikipedia Quantum OpenSearch.
    Provides verifiable citations with direct URLs and snippets.
    """
    results: list[WebSearchResult] = []
    clean_q = re.sub(r'[^\w\s-]', '', query).strip()
    
    # A. Search arXiv API if academic or hybrid
    if category in ("ACADEMIC_RESEARCH", "HYBRID", "WEB_RESEARCH_REQUIRED"):
        try:
            arxiv_term = clean_q
            if "quantum" not in arxiv_term.lower():
                arxiv_term = f"quantum {arxiv_term}"
            encoded = urllib.parse.quote(arxiv_term)
            arxiv_url = f"http://export.arxiv.org/api/query?search_query=all:{encoded}&start=0&max_results=3"
            req = urllib.request.Request(arxiv_url, headers={"User-Agent": "QuantumTutor/2.0"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                xml_data = resp.read().decode("utf-8")
                # Parse entries from Atom XML
                entries = re.findall(r'<entry>(.*?)</entry>', xml_data, re.DOTALL)
                for entry in entries[:2]:
                    title_m = re.search(r'<title>(.*?)</title>', entry, re.DOTALL)
                    id_m = re.search(r'<id>(.*?)</id>', entry)
                    summary_m = re.search(r'<summary>(.*?)</summary>', entry, re.DOTALL)
                    
                    title = re.sub(r'\s+', ' ', title_m.group(1)).strip() if title_m else "Quantum Research Preprint"
                    url = id_m.group(1).strip() if id_m else "https://arxiv.org"
                    summary = re.sub(r'\s+', ' ', summary_m.group(1)).strip() if summary_m else ""
                    
                    results.append({
                        "title": title,
                        "url": url,
                        "content": summary[:400] + "...",
                        "score": 0.95,
                        "domain": "arxiv.org",
                        "source_type": "academic"
                    })
        except Exception as e:
            logger.warning(f"arXiv fallback failed: {e}")

    # B. Search Wikipedia Quantum / Tech Database
    try:
        wiki_term = clean_q
        if not any(k in wiki_term.lower() for k in ["quantum", "qubit"]):
            wiki_term = f"quantum {wiki_term}"
        encoded_wiki = urllib.parse.quote(wiki_term)
        wiki_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={encoded_wiki}&utf8=1&format=json"
        req = urllib.request.Request(wiki_url, headers={"User-Agent": "QuantumTutor/2.0 (edu; contact@quantum-platform.org)"})
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("query", {}).get("search", [])
            for item in items[:max_results - len(results)]:
                title = item.get("title", "")
                snippet_raw = item.get("snippet", "")
                clean_snippet = re.sub(r'<[^>]+>', '', snippet_raw).strip()
                page_url = f"https://en.wikipedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
                results.append({
                    "title": title,
                    "url": page_url,
                    "content": clean_snippet,
                    "score": 0.85,
                    "domain": "wikipedia.org",
                    "source_type": "documentation"
                })
    except Exception as e:
        logger.warning(f"Wikipedia fallback search failed: {e}")

    return {
        "query": query,
        "search_provider": "academic_fallback",
        "answer": None,
        "results": results,
        "is_fallback": True
    }


def tavily_quantum_search(
    query: str, 
    search_depth: str = "basic", 
    max_results: int = 5, 
    category: str = "WEB_RESEARCH_REQUIRED"
) -> tuple[list[dict], str]:
    """Convenience helper returning (results, provider)."""
    res = search_tavily(query, category=category, max_results=max_results)
    return res["results"], res["search_provider"]
