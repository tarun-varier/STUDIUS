from pathlib import Path
from typing import Any, List
import json
import re

from llama_index.core import PropertyGraphIndex, SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import Document
from llama_index.llms.mistralai import MistralAI
from llama_index.core import StorageContext, load_index_from_storage

from app.services.graph_rag import GraphRAGExtractor, GraphRAGQueryEngine, GraphRAGStore, KG_TRIPLET_EXTRACT_TMPL
from app.core.config import settings

class RAGService:
    def __init__(self, storage_dir: str = "storage"):
        self.llm = MistralAI(api_key=settings.MISTRAL_API_KEY)
        self.extractor = GraphRAGExtractor(
            llm=self.llm, 
            extract_prompt=KG_TRIPLET_EXTRACT_TMPL, 
            max_paths_per_chunk=2, 
            parse_fn=self.parse_fn
        )
        self.storage_path = Path(storage_dir)
        self.storage_path.mkdir(exist_ok=True)
        
        # Load existing index if available, else initialize new
        self.index = self._load_or_create_index()

    def _load_or_create_index(self):
        try:
            if (self.storage_path / "docstore.json").exists():
                storage_context = StorageContext.from_defaults(persist_dir=str(self.storage_path))
                return load_index_from_storage(storage_context)
            else:
                # Initialize with empty graph store if no index exists
                # We use GraphRAGStore (SimplePropertyGraphStore) 
                return PropertyGraphIndex(
                    nodes=[], 
                    property_graph_store=GraphRAGStore(), 
                    kg_extractors=[self.extractor],
                    show_progress=True
                )
        except Exception as e:
            print(f"Error loading index: {e}. creating new one.")
            return PropertyGraphIndex(
                nodes=[], 
                property_graph_store=GraphRAGStore(), 
                kg_extractors=[self.extractor],
                show_progress=True
            )

    def ingest_file(self, file_path: str):
        """Read file, split, and build graph index."""
        documents = SimpleDirectoryReader(input_files=[file_path]).load_data()
        
        splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=20)
        nodes = splitter.get_nodes_from_documents(documents)
        
        # Insert nodes into the existing index
        self.index.insert_nodes(nodes)
        
        # Persist changes to disk
        self.index.storage_context.persist(persist_dir=str(self.storage_path))
        print(f"Ingested {file_path} and persisted to {self.storage_path}")

    def query(self, query_str: str) -> str:
        """Query the graph using GraphRAGQueryEngine."""
        # Note: GraphRAGStore needs to be passed explicitly if not embedded
        # The CustomQueryEngine logic expects the store to have communities built
        
        # We need to access the underlying graph store
        graph_store = self.index.property_graph_store
        
        # Initialize our Custom Engine
        query_engine = GraphRAGQueryEngine(llm=self.llm, graph_store=graph_store)
        return query_engine.query(query_str)

    @staticmethod
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
