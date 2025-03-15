
from retrieval_engine import RetrievalEngine, Document
from alu_brain_utils import ALUBrainManager
from typing import List, Dict, Any, Optional

class ExtendedRetrievalEngine(RetrievalEngine):
    """
    Extends the base RetrievalEngine to utilize the ALU Brain JSON knowledge base
    """
    
    def __init__(self):
        super().__init__()
        self.alu_brain = ALUBrainManager()
        print("Extended Retrieval Engine initialized with ALU Brain integration")
    
    def retrieve_context(self, query: str, role: str = "student", **kwargs):
        """
        Enhanced retrieve_context that combines vector store results with ALU Brain results
        """
        # Get results from the original vector store (parent class)
        vector_results = super().retrieve_context(query, role, **kwargs)
        
        # Get results from ALU Brain
        brain_results = self.alu_brain.search(query, top_k=3)
        brain_context = self.alu_brain.format_for_context(brain_results)
        
        # Convert ALU Brain results to Document format to match vector store results
        if brain_results:
            for result in brain_results:
                entry = result['entry']
                doc = Document(
                    text=f"{entry.get('question', '')}\n\n{entry.get('answer', '')}",
                    metadata={
                        'title': entry.get('question', 'ALU Knowledge'),
                        'source': f"ALU Brain: {result['category']}",
                        'type': entry.get('type', 'text')
                    }
                )
                vector_results.append(doc)
        
        return vector_results
