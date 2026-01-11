import json
import os
from typing import Any
from llama_index.llms.mistralai import MistralAI
import re
from llama_index.core.graph_stores import SimplePropertyGraphStore
import networkx as nx
from graspologic.partition import hierarchical_leiden

from pathlib import Path
from llama_index.core.llms import ChatMessage


class GraphRAGStore(SimplePropertyGraphStore):
    max_cluster_size = 5

    def __init__(self, *args, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.community_summary = {}

    def persist(self, persist_path: str, fs=None) -> None:
        super().persist(persist_path, fs)
        # Save summary to a separate file
        path_obj = Path(persist_path)
        # If it's a directory (unlikely for persist_path in recent versions, but check just in case):
        if path_obj.is_dir():
             summary_path = path_obj / "community_summary.json"
        else:
             summary_path = path_obj.parent / "community_summary.json"
             
        with open(summary_path, "w") as f:
            json.dump(self.community_summary, f)

    @classmethod
    def from_persist_dir(cls, persist_dir: str, fs=None) -> "GraphRAGStore":
        obj = super().from_persist_dir(persist_dir, fs)
        
        summary_path = Path(persist_dir) / "community_summary.json"
        if summary_path.exists():
            with open(summary_path, "r") as f:
                obj.community_summary = json.load(f)
        return obj

    @classmethod
    def from_persist_path(cls, persist_path: str, fs=None) -> "GraphRAGStore":
         # Attempt to load using super's method if available
         obj = super().from_persist_path(persist_path, fs) if hasattr(super(), "from_persist_path") else cls()
         
         path_obj = Path(persist_path)
         summary_path = path_obj.parent / "community_summary.json"
         if summary_path.exists():
             with open(summary_path, "r") as f:
                 obj.community_summary = json.load(f)
         return obj

    def generate_community_summary(self, text):
        """Generate summary for a given text using an LLM."""
        messages = [
            ChatMessage(
                role="system",
                content=(
                    "You are provided with a set of relationships from a knowledge graph, each represented as "
                    "entity1->entity2->relation->relationship_description. Your task is to create a summary of these "
                    "relationships. The summary should include the names of the entities involved and a concise synthesis "
                    "of the relationship descriptions. The goal is to capture the most critical and relevant details that "
                    "highlight the nature and significance of each relationship. Ensure that the summary is coherent and "
                    "integrates the information in a way that emphasizes the key aspects of the relationships."
                ),
            ),
            ChatMessage(role="user", content=text),
        ]
        response = MistralAI().chat(messages)
        clean_response = re.sub(r"^assistant:\s*", "", str(response)).strip()
        return clean_response

    def build_communities(self):
        """Builds communities from the graph and summarizes them."""
        nx_graph = self._create_nx_graph()
        if nx_graph.number_of_nodes() == 0:
            return

        community_hierarchical_clusters = hierarchical_leiden(
            nx_graph, max_cluster_size=self.max_cluster_size
        )
        community_info = self._collect_community_info(
            nx_graph, community_hierarchical_clusters
        )
        self._summarize_communities(community_info)

    def _create_nx_graph(self):
        """Converts internal graph representation to NetworkX graph."""
        nx_graph = nx.Graph()
        for node in self.graph.nodes.values():
            nx_graph.add_node(str(node))
        for relation in self.graph.relations.values():
            nx_graph.add_edge(
                relation.source_id,
                relation.target_id,
                relationship=relation.label,
                description=relation.properties.get("relationship_description", "No description"),
            )
        return nx_graph

    def _collect_community_info(self, nx_graph, clusters):
        """Collect detailed information for each node based on their community."""
        community_mapping = {item.node: item.cluster for item in clusters}
        community_info = {}
        for item in clusters:
            cluster_id = item.cluster
            node = item.node
            if cluster_id not in community_info:
                community_info[cluster_id] = []

            for neighbor in nx_graph.neighbors(node):
                if community_mapping[neighbor] == cluster_id:
                    edge_data = nx_graph.get_edge_data(node, neighbor)
                    if edge_data:
                        detail = f"{node} -> {neighbor} -> {edge_data['relationship']} -> {edge_data['description']}"
                        community_info[cluster_id].append(detail)
        return community_info

    def _summarize_communities(self, community_info):
        """Generate and store summaries for each community."""
        for community_id, details in community_info.items():
            details_text = (
                "\n".join(details) + "."
            )  # Ensure it ends with a period
            self.community_summary[
                community_id
            ] = self.generate_community_summary(details_text)

    def get_community_summaries(self):
        """Returns the community summaries, building them if not already done."""
        if not self.community_summary:
            self.build_communities()
        return self.community_summary
