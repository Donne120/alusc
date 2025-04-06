
from typing import List, Dict, Any, Optional
from nyptho import NypthoCore, MetaLearningEngine, KnowledgeDistiller

class NypthoIntegration:
    """
    Integrates the Nyptho meta-learning system with the prompt engine
    - Observes interactions between other AI systems and users
    - Learns from these interactions to improve responses
    - Can function as an independent AI model
    """
    
    def __init__(self):
        # Initialize the Nyptho core components
        self.nyptho_core = NypthoCore()
        self.meta_learner = MetaLearningEngine(self.nyptho_core)
        self.knowledge_distiller = KnowledgeDistiller()
        
        # Track models that Nyptho has observed
        self.observed_models = set()
        
        print("Nyptho Integration initialized")
    
    def observe_model(self, 
                     query: str, 
                     response: str, 
                     model_id: str, 
                     context: Optional[List[Dict[str, Any]]] = None) -> None:
        """
        Have Nyptho observe and learn from another model's response
        
        Args:
            query: User query
            response: Model response
            model_id: Identifier for the model
            context: Context used for the response
        """
        # Add to observed models
        self.observed_models.add(model_id)
        
        # Process with meta learner
        self.meta_learner.observe_model_interaction(
            model_id=model_id,
            query=query,
            response=response,
            context=context
        )
        
        # Process with knowledge distiller
        self.knowledge_distiller.process_interaction(
            query=query,
            response=response,
            source_model=model_id
        )
        
        print(f"Nyptho observed {model_id}'s response to query: {query[:30]}...")
    
    def generate_response(self, 
                         query: str, 
                         context: Optional[List[Dict[str, Any]]] = None,
                         personality: Optional[Dict[str, float]] = None) -> str:
        """
        Generate a response using Nyptho's learned patterns
        
        Args:
            query: User query
            context: Available context
            personality: Personality traits to use
            
        Returns:
            Generated response
        """
        # Check if Nyptho has enough observations to generate good responses
        status = self.meta_learner.get_learning_status()
        
        if status["observation_count"] < 10:
            return (
                "I'm still in early learning stages and haven't observed enough interactions yet. "
                "As I observe more AI responses, my abilities will improve."
            )
        
        # Enrich context with knowledge from knowledge distiller if available
        enriched_context = context or []
        
        # Query knowledge base
        knowledge_results = self.knowledge_distiller.query_knowledge(query)
        
        if knowledge_results:
            # Add top 3 most relevant knowledge items to context
            for kr in knowledge_results[:3]:
                enriched_context.append({
                    "text": kr["claim"],
                    "source": f"Nyptho Knowledge ({kr['confidence']:.2f} confidence)",
                    "type": "knowledge"
                })
        
        # Generate response using core
        response = self.nyptho_core.generate_response(
            query=query,
            context=enriched_context,
            persona=personality
        )
        
        return response
    
    def get_status(self) -> Dict[str, Any]:
        """Get the current status of Nyptho"""
        learning_status = self.meta_learner.get_learning_status()
        knowledge_stats = self.knowledge_distiller.get_knowledge_stats()
        
        return {
            "learning": learning_status,
            "knowledge": knowledge_stats,
            "observed_models": list(self.observed_models),
            "ready": learning_status["observation_count"] >= 10
        }
    
    def get_model_comparison(self) -> Dict[str, Any]:
        """Get a comparison of observed models"""
        if len(self.observed_models) < 2:
            return {"status": "Not enough models observed for comparison"}
            
        return self.meta_learner.compare_models(list(self.observed_models))
    
    def set_personality(self, personality_traits: Dict[str, float]) -> None:
        """Update Nyptho's personality traits"""
        self.nyptho_core.set_personality(personality_traits)
        
        return {
            "status": "updated",
            "personality": self.nyptho_core.personality_traits
        }
