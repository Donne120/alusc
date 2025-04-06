
import random
import time
from typing import List, Dict, Any, Optional

from retrieval_engine import Document

class ResponseGenerator:
    """Handles the generation of responses based on context and query"""
    
    def __init__(self):
        pass
    
    def generate_response(self, 
                         query: str, 
                         context: List[Document], 
                         role: str = "student") -> str:
        """
        Generate a response using context and role
        This is a placeholder for an actual LLM service in production
        """
        # Simulate thinking time
        time.sleep(0.5)
        
        # Look for ALU Brain content in the context
        brain_content = ""
        alu_brain_docs = [doc for doc in context if "ALU Brain" in doc.metadata.get('source', '')]
        
        if alu_brain_docs:
            # Use the structured content from ALU Brain
            selected_doc = random.choice(alu_brain_docs)
            brain_content = selected_doc.text
            source_category = selected_doc.metadata.get('source', '').replace('ALU Brain: ', '')
            
            # Format response based on document type
            doc_type = selected_doc.metadata.get('type', 'text')
            
            if 'link' in doc_type:
                return f"Here's information about your query on {query}:\n\n{brain_content}\n\nYou can find more details on the ALU website."
            
            elif 'table' in doc_type or 'statistical' in doc_type:
                return f"Based on ALU data regarding {query}:\n\n{brain_content}\n\nThese figures are from our official records."
            
            elif 'procedural' in doc_type:
                return f"Here's the process you asked about:\n\n{brain_content}\n\nIf you need further assistance, please contact the relevant department."
            
            elif 'long' in doc_type:
                return f"Here's a comprehensive answer to your question about {query}:\n\n{brain_content}\n\nI hope this detailed explanation helps!"
            
            else:
                return f"Regarding your question about {query}:\n\n{brain_content}\n\nThis information is from our {source_category.replace('_', ' ')} knowledge base."
        
        # Fall back to the original response generation if no ALU Brain content is found
        query_lower = query.lower()
        
        # Add some relevant context if available
        context_text = ""
        if context:
            # Take a random snippet from the context
            doc = random.choice(context)
            context_text = f"\n\nBased on our records: {doc.text[:150]}..."
        
        # Create role-specific responses
        if role == "admin":
            return f"Administrative response: I can help you with that administrative query about '{query}'. As an ALU administrator, you have access to all university systems and processes.{context_text}"
        
        elif role == "faculty":
            return f"Faculty response: Thank you for your faculty query about '{query}'. I can assist with course materials, teaching resources, and student management.{context_text}"
        
        else:  # student or default
            if "course" in query_lower or "class" in query_lower:
                return f"I can help with your question about ALU courses. The curriculum at ALU is designed to be practical and focused on developing leadership skills.{context_text}"
            
            elif "assignment" in query_lower or "homework" in query_lower:
                return f"Regarding your assignment question: ALU assignments are designed to be practical and applicable to real-world situations. Make sure to follow the rubric and submission guidelines.{context_text}"
            
            elif "campus" in query_lower or "facility" in query_lower:
                return f"ALU has state-of-the-art campus facilities designed to enhance the learning experience. The campus includes collaborative spaces, technology labs, and areas for both social and academic activities.{context_text}"
            
            else:
                return f"Thank you for your question about '{query}'. As an ALU student, I'm here to support your educational journey at African Leadership University.{context_text}"
