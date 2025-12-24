"""
GraphRAG Service Module
=======================

This package implements Graph Retrieval-Augmented Generation (GraphRAG)
pipelines, including knowledge graph extraction, storage, and querying.

Exposed Classes:
    - GraphRAGExtractor: Extracts entities and relationships from text.
    - GraphRAGStore: Manages the graph storage and community detection.
    - GraphRAGQueryEngine: Handles query processing over the graph.
"""
__version__ = "0.1.0"

from typing import TYPE_CHECKING
from .templates import KG_TRIPLET_EXTRACT_TMPL

# Define __all__ explicitly so tools know what is available
__all__ = ["GraphRAGExtractor", "GraphRAGQueryEngine", "GraphRAGStore", "KG_TRIPLET_EXTRACT_TMPL"]

if TYPE_CHECKING:
    # These imports are only for IDE autocompletion and type checkers
    from .extractor import GraphRAGExtractor
    from .query_engine import GraphRAGQueryEngine
    from .store import GraphRAGStore

def __getattr__(name: str):
    """
    Lazy load modules only when they are accessed.
    """
    if name == "GraphRAGExtractor":
        from .extractor import GraphRAGExtractor
        return GraphRAGExtractor
    
    if name == "GraphRAGQueryEngine":
        from .query_engine import GraphRAGQueryEngine
        return GraphRAGQueryEngine
        
    if name == "GraphRAGStore":
        from .store import GraphRAGStore
        return GraphRAGStore
        
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")