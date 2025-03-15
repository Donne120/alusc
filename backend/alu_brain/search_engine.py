
from typing import List, Dict, Any, Optional
import re

class BrainSearchEngine:
    """Handles search operations within the ALU Brain knowledge base"""
    
    def search(self, query: str, knowledge_base: Dict[str, Any], top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Enhanced keyword-based search in the knowledge base
        Uses advanced keyword matching with contextual relevance scoring
        """
        results = []
        query_terms = self._preprocess_query(query)
        
        # Search through all entries in all categories
        for category, data in knowledge_base.items():
            category_relevance = self._calculate_category_relevance(category, query_terms)
            
            for entry in data.get('entries', []):
                # Initialize base score with category relevance
                score = category_relevance
                
                # Check question field with contextual weighting
                question = entry.get('question', '').lower()
                question_score = self._calculate_text_match_score(question, query_terms, weight=3)
                score += question_score
                
                # Check answer field
                answer = entry.get('answer', '').lower()
                answer_score = self._calculate_text_match_score(answer, query_terms, weight=1)
                score += answer_score
                
                # Additional relevance from metadata if available
                if 'metadata' in entry:
                    metadata_text = ' '.join([str(v) for v in entry['metadata'].values()]).lower()
                    metadata_score = self._calculate_text_match_score(metadata_text, query_terms, weight=0.5)
                    score += metadata_score
                
                # Check entry type for additional context-specific scoring
                entry_type = entry.get('type', 'text')
                if self._is_type_relevant(entry_type, query_terms):
                    score += 2
                
                if score > 0:
                    results.append({
                        'entry': entry,
                        'category': category,
                        'score': score
                    })
        
        # Sort by score and limit to top_k
        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:top_k]
    
    def _preprocess_query(self, query: str) -> List[str]:
        """Process the query to extract meaningful terms"""
        # Remove punctuation and convert to lowercase
        query = re.sub(r'[^\w\s]', ' ', query.lower())
        
        # Split into terms and filter out common stop words and short terms
        stop_words = {'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
                     'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with'}
        terms = [term for term in query.split() if term not in stop_words and len(term) > 2]
        
        return terms
    
    def _calculate_text_match_score(self, text: str, query_terms: List[str], weight: float = 1.0) -> float:
        """Calculate a weighted score for term matches in text"""
        if not text or not query_terms:
            return 0
            
        score = 0
        # Score exact phrase match higher
        if all(term in text for term in query_terms):
            score += 5 * weight
        
        # Score for individual terms
        for term in query_terms:
            if term in text:
                # Score for term frequency
                term_count = text.count(term)
                score += min(term_count, 3) * weight  # Cap at 3 to avoid over-counting
                
                # Higher score for terms at the beginning
                if text.startswith(term) or re.search(r'^\W+' + re.escape(term), text):
                    score += 2 * weight
        
        return score
    
    def _calculate_category_relevance(self, category: str, query_terms: List[str]) -> float:
        """Determine how relevant a category is to the query"""
        category_words = category.lower().replace('_', ' ').split()
        
        # Check for direct category matches in query
        common_terms = set(category_words) & set(query_terms)
        if common_terms:
            return len(common_terms) * 2
        
        return 0
    
    def _is_type_relevant(self, entry_type: str, query_terms: List[str]) -> bool:
        """Check if the entry type is specifically relevant to the query"""
        type_indicators = {
            'link_response': {'link', 'website', 'url', 'visit', 'webpage'},
            'table_response': {'table', 'data', 'compare', 'comparison', 'list'},
            'statistical_response': {'statistics', 'numbers', 'percentage', 'figure', 'stats', 'statistical'},
            'date_response': {'date', 'when', 'deadline', 'schedule', 'calendar', 'timing'},
            'long_response': {'explain', 'detail', 'comprehensive', 'thorough', 'complete'},
            'short_response': {'brief', 'quick', 'summary', 'short'}
        }
        
        if entry_type in type_indicators:
            return any(term in type_indicators[entry_type] for term in query_terms)
        
        return False
    
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
