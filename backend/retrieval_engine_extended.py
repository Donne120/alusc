
from retrieval_engine import RetrievalEngine, Document
from alu_brain import ALUBrainManager
from typing import List, Dict, Any, Optional

class ExtendedRetrievalEngine(RetrievalEngine):
    """
    Extends the base RetrievalEngine to utilize the ALU Brain JSON knowledge base
    with enhanced integration between vector store and structured knowledge
    """
    
    def __init__(self):
        super().__init__()
        self.alu_brain = ALUBrainManager()
        print("Extended Retrieval Engine initialized with ALU Brain integration")
    
    def retrieve_context(self, query: str, role: str = "student", **kwargs):
        """
        Enhanced retrieve_context that combines vector store results with ALU Brain results
        using intelligent merging based on relevance scores
        """
        # Get results from the original vector store (parent class)
        vector_results = super().retrieve_context(query, role, **kwargs)
        
        # Get results from ALU Brain
        brain_results = self.alu_brain.search(query, top_k=5)  # Increased from 3 to get more diversity
        
        # Process ALU Brain results if available
        brain_documents = []
        if brain_results:
            brain_context = self.alu_brain.format_for_context(brain_results)
            
            for i, result in enumerate(brain_results):
                entry = result['entry']
                category = result['category']
                
                # Extract core information
                question = entry.get('question', '')
                answer = entry.get('answer', '')
                entry_type = entry.get('type', 'text')
                
                # Create text content based on entry type
                if entry_type == 'link_response' and 'links' in entry:
                    links_text = "\n".join([f"- {link.get('text', '')}: {link.get('url', '')}" 
                                          for link in entry.get('links', [])])
                    text = f"{question}\n\n{answer}\n\n{links_text}"
                
                elif entry_type == 'table_response' and 'table' in entry:
                    table = entry.get('table', {})
                    if 'headers' in table and 'rows' in table:
                        # Simple text representation of the table
                        table_text = "Table data:\n"
                        for row in table.get('rows', []):
                            table_text += f"  {', '.join(row)}\n"
                        text = f"{question}\n\n{answer}\n\n{table_text}"
                    else:
                        text = f"{question}\n\n{answer}"
                
                elif entry_type in ['statistical_response', 'date_response', 'procedural_response']:
                    # For these types, include the specialized content
                    special_content = ""
                    if 'statistics' in entry:
                        special_content = "\n".join([f"- {stat.get('metric', '')}: {stat.get('value', '')}" 
                                                   for stat in entry.get('statistics', [])])
                    elif 'dates' in entry:
                        special_content = "\n".join([f"- {date.get('round', '')}: {date.get('deadline', '')}" 
                                                   for date in entry.get('dates', [])])
                    elif 'steps' in entry:
                        steps = entry.get('steps', [])
                        special_content = "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps)])
                    
                    text = f"{question}\n\n{answer}\n\n{special_content}"
                
                else:
                    # Default format for text responses
                    text = f"{question}\n\n{answer}"
                
                # Create Document object
                doc = Document(
                    text=text,
                    metadata={
                        'title': question or f"ALU {category.replace('_', ' ').title()} Knowledge",
                        'source': f"ALU Brain: {category.replace('_', ' ').title()}",
                        'type': entry_type,
                        'score': result.get('score', 0)
                    }
                )
                brain_documents.append(doc)
        
        # Intelligently merge vector and brain results
        merged_results = self._merge_results(vector_results, brain_documents)
        
        return merged_results
    
    def _merge_results(self, vector_results: List[Document], brain_results: List[Document]) -> List[Document]:
        """
        Intelligently merge vector and brain results based on relevance and diversity
        """
        # Start with all vector results
        all_results = list(vector_results)
        
        # If no brain results, just return vector results
        if not brain_results:
            return all_results
            
        # If no vector results, just return brain results
        if not vector_results:
            return brain_results
        
        # Interleave results, prioritizing higher scores
        # First, sort both lists by score (if available)
        vector_results.sort(key=lambda x: x.score if x.score is not None else 0, reverse=True)
        brain_results.sort(key=lambda x: x.metadata.get('score', 0), reverse=True)
        
        # Take the top result from brain results and insert at position 2
        # (This ensures at least one high-quality structured result appears near the top)
        if brain_results:
            top_brain = brain_results.pop(0)
            if len(all_results) >= 1:
                all_results.insert(1, top_brain)
            else:
                all_results.append(top_brain)
        
        # Interleave remaining results
        remaining = []
        while brain_results and len(remaining) < 8:  # Limit to prevent too many results
            # Take one from brain
            if brain_results:
                remaining.append(brain_results.pop(0))
            
        # Add remaining interleaved results
        i = 2  # Start after the first vector result and the top brain result
        for doc in remaining:
            if i < len(all_results):
                all_results.insert(i, doc)
                i += 2  # Skip every other position
            else:
                all_results.append(doc)
        
        # Ensure we don't return too many results (limit to 10)
        return all_results[:10]
