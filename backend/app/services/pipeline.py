from llama_index.core import PropertyGraphIndex
from .graph_rag import GraphRAGExtractor, GraphRAGQueryEngine, GraphRAGStore, KG_TRIPLET_EXTRACT_TMPL
from typing import Any, List
import re
import json
from llama_index.llms.mistralai import MistralAI
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import Document


class RAGService:

    def __init__(self):
        self.llm = MistralAI()
        self.extractor = GraphRAGExtractor(llm=self.llm, extract_prompt=KG_TRIPLET_EXTRACT_TMPL, max_paths_per_chunk=2, parse_fn=self.parse_fn)
        self.store = GraphRAGStore()
        self.query_engine = GraphRAGQueryEngine(llm=self.llm, graph_store=self.store)
        
    def run_pipeline(self, documents: List[Document]):
        
        splitter = SentenceSplitter(
            chunk_size=1024,
            chunk_overlap=20,
        )
        nodes = splitter.get_nodes_from_documents(documents)
        self.index = PropertyGraphIndex(nodes=nodes, property_graph_store=self.store, kg_extractors=[self.extractor], show_progress=True)
        
    def parse_fn(response_str: str) -> Any:
        json_pattern = r"\{.*\}"
        match = re.search(json_pattern, response_str, re.DOTALL)
        entities = []
        relationships = []
        if not match:
            return entities, relationships
        json_str = match.group(0)
        try:
            data = json.loads(json_str)
            entities = [
                (
                    entity["entity_name"],
                    entity["entity_type"],
                    entity["entity_description"],
                )
                for entity in data.get("entities", [])
            ]
            relationships = [
                (
                    relation["source_entity"],
                    relation["target_entity"],
                    relation["relation"],
                    relation["relationship_description"],
                )
                for relation in data.get("relationships", [])
            ]
            return entities, relationships
        except json.JSONDecodeError as e:
            print("Error parsing JSON:", e)
            return entities, relationships
