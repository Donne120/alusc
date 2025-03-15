
import os
import json
from typing import List, Dict, Any, Optional
from pathlib import Path

class ALUBrainManager:
    """
    Manages the ALU Brain JSON knowledge base:
    - Loads and indexes JSON files
    - Provides search and retrieval functions
    - Formats responses for the prompt engine
    """
    
    def __init__(self, brain_dir: str = "alu_brain"):
        self.brain_dir = Path(brain_dir)
        self.knowledge_base = {}
        self.load_brain()
    
    def load_brain(self):
        """Load all JSON files from the alu_brain directory"""
        if not self.brain_dir.exists():
            print(f"Warning: ALU Brain directory not found at {self.brain_dir}")
            return
            
        json_files = list(self.brain_dir.glob("*.json"))
        if not json_files:
            print(f"Warning: No JSON files found in {self.brain_dir}")
            return
            
        for json_path in json_files:
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    category = data.get('category')
                    if category and 'entries' in data:
                        self.knowledge_base[category] = data
                        print(f"Loaded {len(data['entries'])} entries from {json_path.name}")
            except Exception as e:
                print(f"Error loading {json_path}: {e}")
    
    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Simple keyword-based search in the knowledge base
        In a production environment, this would use embeddings and semantic search
        """
        results = []
        query_terms = query.lower().split()
        
        # Search through all entries in all categories
        for category, data in self.knowledge_base.items():
            for entry in data.get('entries', []):
                score = 0
                
                # Check question field
                question = entry.get('question', '').lower()
                for term in query_terms:
                    if term in question:
                        score += 2  # Higher weight for matches in the question
                
                # Check answer field
                answer = entry.get('answer', '').lower()
                for term in query_terms:
                    if term in answer:
                        score += 1
                
                if score > 0:
                    results.append({
                        'entry': entry,
                        'category': category,
                        'score': score
                    })
        
        # Sort by score and limit to top_k
        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:top_k]
    
    def get_entry_by_id(self, entry_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a specific entry by its ID"""
        for category, data in self.knowledge_base.items():
            for entry in data.get('entries', []):
                if entry.get('id') == entry_id:
                    return {
                        'entry': entry,
                        'category': category
                    }
        return None
    
    def get_entries_by_category(self, category: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get entries from a specific category"""
        if category not in self.knowledge_base:
            return []
            
        entries = self.knowledge_base[category].get('entries', [])
        return [{'entry': entry, 'category': category} for entry in entries[:limit]]
    
    def format_for_context(self, results: List[Dict[str, Any]]) -> str:
        """Format search results as context for the prompt engine"""
        if not results:
            return "No relevant information found in the ALU knowledge base."
            
        formatted_context = "### Relevant information from ALU Brain:\n\n"
        
        for result in results:
            entry = result['entry']
            category = result['category']
            
            formatted_context += f"Category: {category.replace('_', ' ').title()}\n"
            formatted_context += f"Question: {entry.get('question', '')}\n"
            
            # Format answer based on entry type
            entry_type = entry.get('type', 'short_response')
            answer = entry.get('answer', '')
            
            if entry_type == 'link_response' and 'links' in entry:
                formatted_context += f"Answer: {answer}\n"
                for link in entry.get('links', []):
                    formatted_context += f"- {link.get('text', '')}: {link.get('url', '')}\n"
            
            elif entry_type == 'table_response' and 'table' in entry:
                formatted_context += f"Answer: {answer}\n"
                table = entry.get('table', {})
                if 'headers' in table and 'rows' in table:
                    # Simple text formatting of the table
                    formatted_context += "Table data:\n"
                    for row in table.get('rows', []):
                        formatted_context += f"  {', '.join(row)}\n"
            
            elif entry_type == 'statistical_response' and 'statistics' in entry:
                formatted_context += f"Answer: {answer}\n"
                for stat in entry.get('statistics', []):
                    formatted_context += f"- {stat.get('metric', '')}: {stat.get('value', '')}\n"
            
            elif entry_type == 'date_response' and 'dates' in entry:
                formatted_context += f"Answer: {answer}\n"
                for date_item in entry.get('dates', []):
                    formatted_context += f"- {date_item.get('round', '')}: {date_item.get('deadline', '')}\n"
            
            else:
                # Default formatting for text-based responses
                formatted_context += f"Answer: {answer}\n"
            
            formatted_context += "\n---\n\n"
        
        return formatted_context

# Example usage
if __name__ == "__main__":
    alu_brain = ALUBrainManager()
    results = alu_brain.search("scholarship")
    context = alu_brain.format_for_context(results)
    print(context)
