
from typing import List, Dict, Any, Optional

class BrainSearchEngine:
    """Handles search operations within the ALU Brain knowledge base"""
    
    def search(self, query: str, knowledge_base: Dict[str, Any], top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Simple keyword-based search in the knowledge base
        In a production environment, this would use embeddings and semantic search
        """
        results = []
        query_terms = query.lower().split()
        
        # Search through all entries in all categories
        for category, data in knowledge_base.items():
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
    
    def get_entry_by_id(self, entry_id: str, knowledge_base: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Retrieve a specific entry by its ID"""
        for category, data in knowledge_base.items():
            for entry in data.get('entries', []):
                if entry.get('id') == entry_id:
                    return {
                        'entry': entry,
                        'category': category
                    }
        return None
    
    def get_entries_by_category(self, category: str, knowledge_base: Dict[str, Any], limit: int = 10) -> List[Dict[str, Any]]:
        """Get entries from a specific category"""
        if category not in knowledge_base:
            return []
            
        entries = knowledge_base[category].get('entries', [])
        return [{'entry': entry, 'category': category} for entry in entries[:limit]]
