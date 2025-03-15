
import os
import json
from typing import List, Dict, Any, Optional
from pathlib import Path
import json

# For development without an actual LLM service
# In production, this would use a real LLM service
import random
import time

# Import document type
from retrieval_engine import Document

# Directory for storing prompt templates
DATA_DIR = Path("./data")
DATA_DIR.mkdir(exist_ok=True)
PROMPTS_DIR = DATA_DIR / "prompts"
PROMPTS_DIR.mkdir(exist_ok=True)

# Example prompt templates for different situations
DEFAULT_PROMPTS = {
    "general": """
As an AI assistant for African Leadership University (ALU) students, I aim to provide helpful, accurate, and contextual responses.

Context information:
{context}

Chat history:
{history}

User query: {query}

Respond to the query using the context provided, and maintain a friendly and supportive tone.
""",
    "academic": """
As an academic assistant for ALU students, I provide educational guidance and help with coursework.

Relevant academic information:
{context}

Previous conversation:
{history}

Student query: {query}

Provide an academically sound response that helps the student learn and understand the topic better.
""",
    "admin": """
As an administrative assistant for ALU staff, I provide detailed information about university processes, policies, and operations.

Relevant administrative information:
{context}

Previous conversation:
{history}

Admin query: {query}

Provide a comprehensive response with specific details, references to relevant policies or procedures, and actionable next steps if applicable.
""",
    "faculty": """
As a faculty assistant for ALU educators, I help with teaching resources, student management, and academic planning.

Relevant faculty information:
{context}

Previous conversation:
{history}

Faculty query: {query}

Provide a detailed response with teaching recommendations, resource suggestions, or administrative guidance as needed.
"""
}

class PromptEngine:
    """
    Handles prompt engineering and response generation:
    - Dynamic prompt construction based on query, context, and user role
    - Integration with LLM services (placeholder for now)
    - Response formatting and enhancement
    """

    def __init__(self):
        self._initialize_prompt_templates()
        
    def _initialize_prompt_templates(self):
        """Initialize prompt templates"""
        # Save default prompts if they don't exist
        for prompt_type, template in DEFAULT_PROMPTS.items():
            prompt_path = PROMPTS_DIR / f"{prompt_type}_prompt.txt"
            if not prompt_path.exists():
                with open(prompt_path, "w") as f:
                    f.write(template)
    
    def _get_prompt_template(self, role: str = "student") -> str:
        """Get the appropriate prompt template based on user role"""
        # Map roles to prompt types
        role_to_prompt = {
            "student": "general",
            "admin": "admin",
            "faculty": "faculty"
        }
        
        prompt_type = role_to_prompt.get(role, "general")
        if role == "student" and "academic" in self._query_category(self.current_query):
            prompt_type = "academic"
            
        # Load the prompt template
        prompt_path = PROMPTS_DIR / f"{prompt_type}_prompt.txt"
        if prompt_path.exists():
            with open(prompt_path, "r") as f:
                return f.read()
        else:
            # Fall back to default template
            return DEFAULT_PROMPTS.get(prompt_type, DEFAULT_PROMPTS["general"])
    
    def _query_category(self, query: str) -> List[str]:
        """Simple categorization of queries"""
        categories = []
        
        # Academic keywords
        academic_keywords = ["course", "assignment", "exam", "study", "learn", 
                           "class", "lecture", "professor", "grade", "academic"]
        
        # Administrative keywords
        admin_keywords = ["register", "enrollment", "tuition", "deadline", "policy", 
                         "form", "application", "schedule", "payment", "administrative"]
        
        # Simple keyword matching
        query_lower = query.lower()
        if any(keyword in query_lower for keyword in academic_keywords):
            categories.append("academic")
            
        if any(keyword in query_lower for keyword in admin_keywords):
            categories.append("administrative")
            
        if not categories:
            categories.append("general")
            
        return categories
    
    def _format_context(self, documents: List[Document]) -> str:
        """Format context documents into a string"""
        if not documents:
            return "No relevant context found."
            
        formatted_context = "Here is relevant information from the ALU knowledge base:\n\n"
        
        for i, doc in enumerate(documents):
            formatted_context += f"Document {i+1}: {doc.metadata.get('title', 'Untitled')}\n"
            formatted_context += f"Source: {doc.metadata.get('source', 'Unknown')}\n"
            formatted_context += f"Content: {doc.text}\n\n"
            
        return formatted_context
    
    def _format_conversation_history(self, conversation_history: List[Dict[str, Any]]) -> str:
        """Format conversation history into a string"""
        if not conversation_history:
            return "No previous conversation."
            
        formatted_history = "Previous messages:\n\n"
        
        for msg in conversation_history:
            role = msg.get("role", "unknown")
            content = msg.get("text", msg.get("content", ""))
            formatted_history += f"{role.capitalize()}: {content}\n\n"
            
        return formatted_history
    
    def generate_response(
        self, 
        query: str, 
        context: List[Document], 
        conversation_history: List[Dict[str, Any]] = [],
        role: str = "student",
        options: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Generate a response using prompt engineering and context:
        1. Select and fill appropriate prompt template
        2. Call LLM service (placeholder for now)
        3. Format and return response
        """
        self.current_query = query  # Store for categorization
        
        # Get the appropriate prompt template
        prompt_template = self._get_prompt_template(role)
        
        # Format context and history
        formatted_context = self._format_context(context)
        formatted_history = self._format_conversation_history(conversation_history)
        
        # Fill in the prompt template
        prompt = prompt_template.format(
            query=query,
            context=formatted_context,
            history=formatted_history
        )
        
        # In a real implementation, this would call an actual LLM service
        # For now, we'll use our enhanced placeholder response that leverages ALU Brain
        response = self._generate_enhanced_response(query, context, role)
        
        return response
    
    def _generate_enhanced_response(self, query: str, context: List[Document], role: str) -> str:
        """
        Generate an enhanced response that leverages the ALU Brain
        This is an improved version of the placeholder response generator
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
