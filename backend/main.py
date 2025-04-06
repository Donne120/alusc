import patch_huggingface
import os
import json
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Safe wrapper for handling Document objects
def ensure_iterable(obj):
    if obj is None:
        return []
    if isinstance(obj, list):
        return obj
    return [obj]

# Import the modules
from document_processor import DocumentProcessor
from retrieval_engine_extended import ExtendedRetrievalEngine
from prompt_engine import PromptEngine
from prompt_engine.nyptho_integration import NypthoIntegration

# Create FastAPI app
app = FastAPI(title="ALU Chatbot Backend")

# Add CORS middleware to allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Make sure to check for environment variables
use_mock_embeddings = os.environ.get("USE_MOCK_EMBEDDINGS", "false").lower() == "true"

# Initialize components
document_processor = DocumentProcessor()
retrieval_engine = ExtendedRetrievalEngine()
prompt_engine = PromptEngine()
nyptho = NypthoIntegration()  # Initialize Nyptho

# Add to your embedding model initialization code - moved into retrieval_engine
# This commented code should be moved to your retrieval engine class initialization
# if os.environ.get("USE_MOCK_EMBEDDINGS", "false").lower() == "true":
#     print("Using mock embedding model as specified in environment")
#     embedding_model = MockEmbeddingModel()
# else:
#     # Try to load real model
#     try:
#         print("Loading embedding model...")
#         embedding_model = SentenceTransformer(model_name_or_path)
#     except Exception as e:
#         print(f"Error loading embedding model: {e}")
#         embedding_model = MockEmbeddingModel()

# Define request models
class QueryRequest(BaseModel):
    query: str
    role: str = "student"
    conversation_history: List[Dict[str, Any]] = []
    options: Optional[Dict[str, Any]] = None

class DocumentMetadata(BaseModel):
    title: str
    source: str
    date: Optional[str] = None

class PersonalitySettings(BaseModel):
    helpfulness: float
    creativity: float
    precision: float
    friendliness: float

# Ensure response generation is safe
def ensure_response_safe(query, context, model_name, role):
    try:
        # Make sure context is iterable
        if context is not None and not isinstance(context, list):
            context = [context]
            
        # If context is empty or None, provide a fallback
        if not context:
            return "I don't have enough information to answer that question. Please ask something else."
            
        return prompt_engine.generate_response(query, context, model_name, role)
    except Exception as e:
        print(f"Error generating response: {e}")
        return f"I'm sorry, I encountered an error processing your request. Please try again later."

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ALU Chatbot backend is running"}

@app.post("/generate")
async def generate_response(request: QueryRequest):
    """Generate a response for the user query"""
    try:
        # Get relevant context from the retrieval engine
        context_docs = retrieval_engine.retrieve_context(
            query=request.query, 
            role=request.role
        )
        
        # Ensure context_docs is always a list
        context_docs = ensure_iterable(context_docs)
        
        # Check if we should use Nyptho
        use_nyptho = False
        if request.options and "use_nyptho" in request.options:
            use_nyptho = request.options["use_nyptho"]
        
        # Set model ID for observation
        model_id = "standard_engine"
        
        # Generate response using appropriate engine
        if use_nyptho and nyptho.get_status()["ready"]:
            # Use Nyptho for response
            personality = None
            if request.options and "personality" in request.options:
                personality = request.options["personality"]
                
            response = nyptho.generate_response(query=request.query, context=context_docs, personality=personality)
            model_id = "nyptho"
        else:
            # Use standard prompt engine - with extra safety
            try:
                response = prompt_engine.generate_response(
                    query=request.query, 
                    context=context_docs, 
                    conversation_history=request.conversation_history, 
                    role=request.role, 
                    options=request.options
                )
            except Exception as e:
                print(f"Error in prompt engine: {e}")
                response = "I'm sorry, I encountered an error processing your request. Please try again later."
        
        # Have Nyptho observe this interaction (it learns from all responses)
        try:
            if model_id != "nyptho":  # Don't observe itself
                nyptho.observe_model(
                    query=request.query,
                    response=response,
                    model_id=model_id,
                    context=context_docs
                )
        except Exception as e:
            print(f"Error during observation: {e}")
        
        # Safely extract metadata from context_docs
        try:
            sources = []
            if context_docs and len(context_docs) > 0:
                for doc in context_docs[:3]:
                    if hasattr(doc, 'metadata'):
                        sources.append(doc.metadata)
        except Exception as e:
            print(f"Error extracting sources: {e}")
            sources = []
            
        return {
            "response": response,
            "sources": sources,
            "engine": model_id
        }
    except Exception as e:
        print(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(None),
    source: str = Form("user-upload"),
    background_tasks: BackgroundTasks = None
):
    """Upload and process a document into the vector store"""
    try:
        # Process the document
        doc_id = await document_processor.process_document(file, title, source)
        
        # Add background task to update the vector store
        if background_tasks:
            background_tasks.add_task(
                retrieval_engine.update_vector_store,
                doc_id
            )
        
        return {"status": "success", "message": "Document uploaded successfully", "doc_id": doc_id}
    except Exception as e:
        print(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
async def list_documents():
    """List all available documents in the knowledge base"""
    try:
        documents = document_processor.list_documents()
        return {"documents": documents}
    except Exception as e:
        print(f"Error listing documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document from the knowledge base"""
    try:
        success = document_processor.delete_document(doc_id)
        if success:
            # Update the vector store to remove the document's embeddings
            retrieval_engine.remove_document(doc_id)
            return {"status": "success", "message": "Document deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Document not found")
    except Exception as e:
        print(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rebuild-index")
async def rebuild_index(background_tasks: BackgroundTasks):
    """Rebuild the vector index with all documents"""
    try:
        background_tasks.add_task(retrieval_engine.rebuild_index)
        return {"status": "success", "message": "Index rebuild started in the background"}
    except Exception as e:
        print(f"Error starting index rebuild: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# New Nyptho-specific endpoints
@app.get("/nyptho/status")
async def get_nyptho_status():
    """Get the current status of Nyptho"""
    try:
        status = nyptho.get_status()
        return status
    except Exception as e:
        print(f"Error getting Nyptho status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/nyptho/model-comparison")
async def get_model_comparison():
    """Get a comparison of observed models"""
    try:
        comparison = nyptho.get_model_comparison()
        return comparison
    except Exception as e:
        print(f"Error getting model comparison: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/nyptho/personality")
async def set_nyptho_personality(settings: PersonalitySettings):
    """Update Nyptho's personality settings"""
    try:
        result = nyptho.set_personality({
            "helpfulness": settings.helpfulness,
            "creativity": settings.creativity,
            "precision": settings.precision,
            "friendliness": settings.friendliness
        })
        return result
    except Exception as e:
        print(f"Error updating personality: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the server
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)


import os
import json
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Import the modules
from document_processor import DocumentProcessor
from retrieval_engine_extended import ExtendedRetrievalEngine
from prompt_engine import PromptEngine
from prompt_engine.nyptho_integration import NypthoIntegration

# Create FastAPI app
app = FastAPI(title="ALU Chatbot Backend")

# Add CORS middleware to allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
document_processor = DocumentProcessor()
retrieval_engine = ExtendedRetrievalEngine()
prompt_engine = PromptEngine()
nyptho = NypthoIntegration()  # Initialize Nyptho

# Define request models
class QueryRequest(BaseModel):
    query: str
    role: str = "student"
    conversation_history: List[Dict[str, Any]] = []
    options: Optional[Dict[str, Any]] = None

class DocumentMetadata(BaseModel):
    title: str
    source: str
    date: Optional[str] = None

class PersonalitySettings(BaseModel):
    helpfulness: float
    creativity: float
    precision: float
    friendliness: float

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ALU Chatbot backend is running"}

@app.post("/generate")
async def generate_response(request: QueryRequest):
    """Generate a response for the user query"""
    try:
        # Get relevant context from the retrieval engine
        context_docs = retrieval_engine.retrieve_context(
            query=request.query, 
            role=request.role
        )
        
        # Check if we should use Nyptho
        use_nyptho = False
        if request.options and "use_nyptho" in request.options:
            use_nyptho = request.options["use_nyptho"]
        
        # Set model ID for observation
        model_id = "standard_engine"
        
        # Generate response using appropriate engine
        if use_nyptho and nyptho.get_status()["ready"]:
            # Use Nyptho for response
            personality = None
            if request.options and "personality" in request.options:
                personality = request.options["personality"]
                
            response = nyptho.generate_response(
                query=request.query,
                context=context_docs,
                personality=personality
            )
            model_id = "nyptho"
        else:
            # Use standard prompt engine
            response = prompt_engine.generate_response(
                query=request.query,
                context=context_docs,
                conversation_history=request.conversation_history,
                role=request.role,
                options=request.options
            )
        
        # Have Nyptho observe this interaction (it learns from all responses)
        if model_id != "nyptho":  # Don't observe itself
            nyptho.observe_model(
                query=request.query,
                response=response,
                model_id=model_id,
                context=context_docs
            )
        
        return {
            "response": response,
            "sources": [doc.metadata for doc in context_docs[:3]] if context_docs else [],
            "engine": model_id
        }
    except Exception as e:
        print(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(None),
    source: str = Form("user-upload"),
    background_tasks: BackgroundTasks = None
):
    """Upload and process a document into the vector store"""
    try:
        # Process the document
        doc_id = await document_processor.process_document(file, title, source)
        
        # Add background task to update the vector store
        if background_tasks:
            background_tasks.add_task(
                retrieval_engine.update_vector_store,
                doc_id
            )
        
        return {"status": "success", "message": "Document uploaded successfully", "doc_id": doc_id}
    except Exception as e:
        print(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
async def list_documents():
    """List all available documents in the knowledge base"""
    try:
        documents = document_processor.list_documents()
        return {"documents": documents}
    except Exception as e:
        print(f"Error listing documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document from the knowledge base"""
    try:
        success = document_processor.delete_document(doc_id)
        if success:
            # Update the vector store to remove the document's embeddings
            retrieval_engine.remove_document(doc_id)
            return {"status": "success", "message": "Document deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Document not found")
    except Exception as e:
        print(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rebuild-index")
async def rebuild_index(background_tasks: BackgroundTasks):
    """Rebuild the vector index with all documents"""
    try:
        background_tasks.add_task(retrieval_engine.rebuild_index)
        return {"status": "success", "message": "Index rebuild started in the background"}
    except Exception as e:
        print(f"Error starting index rebuild: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# New Nyptho-specific endpoints
@app.get("/nyptho/status")
async def get_nyptho_status():
    """Get the current status of Nyptho"""
    try:
        status = nyptho.get_status()
        return status
    except Exception as e:
        print(f"Error getting Nyptho status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/nyptho/model-comparison")
async def get_model_comparison():
    """Get a comparison of observed models"""
    try:
        comparison = nyptho.get_model_comparison()
        return comparison
    except Exception as e:
        print(f"Error getting model comparison: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/nyptho/personality")
async def set_nyptho_personality(settings: PersonalitySettings):
    """Update Nyptho's personality settings"""
    try:
        result = nyptho.set_personality({
            "helpfulness": settings.helpfulness,
            "creativity": settings.creativity,
            "precision": settings.precision,
            "friendliness": settings.friendliness
        })
        return result
    except Exception as e:
        print(f"Error updating personality: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the server
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
