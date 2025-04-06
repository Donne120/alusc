import os
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
import numpy as np

# For vector storage and retrieval
import chromadb
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer

# Create necessary directories
DATA_DIR = Path("./data")
DOCUMENTS_DIR = DATA_DIR / "documents"
METADATA_FILE = DATA_DIR / "document_metadata.json"
VECTOR_DB_DIR = DATA_DIR / "vectordb"
VECTOR_DB_DIR.mkdir(parents=True, exist_ok=True)

# Maximum chunk size for document splitting
MAX_CHUNK_SIZE = 1000  # characters
MAX_CHUNK_OVERLAP = 200  # characters

class Document:
    """Simple document class to store text and metadata"""
    def __init__(self, text: str, metadata: Dict[str, Any], score: Optional[float] = None):
        self.text = text
        self.metadata = metadata
        self.score = score

class RetrievalEngine:
    """
    Handles document retrieval using vector embeddings:
    - Document chunking and embedding
    - Semantic search
    - Context retrieval for the prompt engine
    """

    def __init__(self):
        # Initialize the embedding model - fix scoping issue
        from sentence_transformers import SentenceTransformer
        try:
            # Try to load from Hugging Face hub with explicit model name
            print("Loading embedding model...")
            self.embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', device='cpu')
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Failed to load primary model: {e}")
            try:
                # Use a simpler model as fallback
                self.embedding_model = SentenceTransformer('paraphrase-MiniLM-L6-v2', device='cpu')
            except Exception as e2:
                print(f"Failed to load fallback model: {e2}")
                # Create a very basic mock model as last resort
                self.embedding_model = MockEmbeddingModel()
        
        # Initialize ChromaDB
        self.client = chromadb.PersistentClient(path=str(VECTOR_DB_DIR))
        
        # Create or get the collection - use our already initialized model
        try:
            # Try to use a separate instance for ChromaDB
            try:
                self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
                    model_name='all-MiniLM-L6-v2', device='cpu'
                )
            except Exception as e:
                print(f"Using the same embedding model for ChromaDB: {e}")
                # Use a custom embedding function that uses our existing model
                from chromadb.api.types import Documents, EmbeddingFunction
                
                class CustomEmbeddingFunction(EmbeddingFunction):
                    def __init__(self, model):
                        self.model = model
                    
                    def __call__(self, texts: Documents) -> list:
                        return self.model.encode(texts).tolist()
                
                self.embedding_function = CustomEmbeddingFunction(self.embedding_model)
            
            # Now try to get or create the collection
            try:
                self.collection = self.client.get_collection(
                    name="alu_documents",
                    embedding_function=self.embedding_function
                )
                print("Connected to existing vector collection")
            except ValueError:
                self.collection = self.client.create_collection(
                    name="alu_documents",
                    embedding_function=self.embedding_function
                )
                print("Created new vector collection")
        except Exception as e:
            print(f"Error initializing ChromaDB: {e}")
            # Create a minimal in-memory collection as a last resort
            from chromadb.api.types import Documents, EmbeddingFunction
            class MinimalEmbeddingFunction(EmbeddingFunction):
                def __call__(self, texts: Documents) -> list:
                    return [[0.0] * 384] * len(texts)  # Return zero vectors
            
            try:
                self.client = chromadb.Client()
                self.embedding_function = MinimalEmbeddingFunction()
                self.collection = self.client.create_collection(
                    name="alu_documents",
                    embedding_function=self.embedding_function
                )
                print("Created minimal in-memory collection as fallback")
            except Exception as e2:
                print(f"Failed to create even a minimal collection: {e2}")
                # Create dummy collection attributes to prevent further errors
                self.collection = None
        
        # Initialize document processor reference
        from document_processor import DocumentProcessor
        self.document_processor = DocumentProcessor()

    def _chunk_text(self, text: str, chunk_size: int = MAX_CHUNK_SIZE, chunk_overlap: int = MAX_CHUNK_OVERLAP) -> List[str]:
        """Split text into chunks with overlap"""
        if not text:
            return []
            
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            # Find the end of the chunk
            end = min(start + chunk_size, text_length)
            
            # If we're not at the end of the text, try to find a good breaking point
            if end < text_length:
                # Look for a newline or period near the end
                for break_point in ['\n\n', '\n', '. ', ' ']:
                    last_break = text.rfind(break_point, start, end)
                    if last_break != -1:
                        end = last_break + len(break_point)
                        break
            
            # Add the chunk
            chunks.append(text[start:end])
            
            # Move the start position for the next chunk, considering overlap
            start = end - chunk_overlap if end < text_length else end
        
        return chunks

    def update_vector_store(self, doc_id: str):
        """Process and add a document to the vector store"""
        try:
            # Get document text
            doc_text = self.document_processor.get_document_text(doc_id)
            if not doc_text:
                print(f"Document text not found for ID: {doc_id}")
                return False
            
            # Get document metadata
            with open(METADATA_FILE, "r") as f:
                all_metadata = json.load(f)
            
            if doc_id not in all_metadata:
                print(f"Document metadata not found for ID: {doc_id}")
                return False
                
            metadata = all_metadata[doc_id]
            
            # Chunk the document
            chunks = self._chunk_text(doc_text)
            
            # Prepare for batch add
            doc_ids = []
            metadatas = []
            
            for i, chunk in enumerate(chunks):
                chunk_id = f"{doc_id}_chunk_{i}"
                doc_ids.append(chunk_id)
                
                # Create metadata for the chunk
                chunk_metadata = {
                    "doc_id": doc_id,
                    "chunk_id": i,
                    "title": metadata.get("title", "Untitled"),
                    "source": metadata.get("source", "Unknown"),
                    "chunk_index": i,
                    "total_chunks": len(chunks),
                }
                metadatas.append(chunk_metadata)
            
            # Add to the collection
            if chunks:
                self.collection.add(
                    documents=chunks,
                    ids=doc_ids,
                    metadatas=metadatas
                )
                print(f"Added {len(chunks)} chunks from document {doc_id}")
                return True
            
            return False
            
        except Exception as e:
            print(f"Error updating vector store: {e}")
            return False

    def remove_document(self, doc_id: str):
        """Remove a document's chunks from the vector store"""
        try:
            # Query to find all chunks for this document
            results = self.collection.get(
                where={"doc_id": doc_id}
            )
            
            # Delete the chunks
            if results and results.get("ids"):
                for chunk_id in results["ids"]:
                    self.collection.delete(chunk_id)
                
                print(f"Removed {len(results['ids'])} chunks for document {doc_id}")
                return True
            
            return False
            
        except Exception as e:
            print(f"Error removing document from vector store: {e}")
            return False

    def rebuild_index(self):
        """Rebuild the entire vector index from scratch"""
        try:
            # Clear the collection
            self.collection.delete(where={})
            print("Cleared vector collection")
            
            # Get all document IDs
            with open(METADATA_FILE, "r") as f:
                all_metadata = json.load(f)
            
            # Add each document
            for doc_id in all_metadata.keys():
                self.update_vector_store(doc_id)
            
            print(f"Rebuilt vector index with {len(all_metadata)} documents")
            return True
            
        except Exception as e:
            print(f"Error rebuilding index: {e}")
            return False

    def retrieve_context(self, query: str, role: str = "student", top_k: int = 5) -> List[Document]:
        """
        Retrieve relevant context for a query:
        1. Perform semantic search against the vector store
        2. Return top matches as Document objects
        """
        try:
            # Check if collection is None
            if self.collection is None:
                print("No vector collection available, falling back to direct knowledge base")
                # Return a mock result with content from the ALU Brain files
                from glob import glob
                import json
                
                # Look for JSON files in the alu_brain directory
                brain_files = glob("alu_brain/*.json")
                documents = []
                
                # Load at most 2 random entries from each file to create context
                for file_path in brain_files[:3]:  # Limit to 3 files max
                    try:
                        with open(file_path, 'r') as f:
                            data = json.load(f)
                            category = data.get("category", "unknown")
                            entries = data.get("entries", [])
                            
                            # Add up to 2 entries from this file
                            for entry in entries[:2]:
                                doc_text = f"Category: {category}\nQuestion: {entry.get('question', '')}\nAnswer: {entry.get('answer', '')}"
                                metadata = {
                                    "source": file_path,
                                    "category": category,
                                    "id": entry.get("id", "unknown")
                                }
                                documents.append(Document(
                                    text=doc_text,
                                    metadata=metadata,
                                    score=0.5  # Default score
                                ))
                    except Exception as e:
                        print(f"Error loading brain file {file_path}: {e}")
                        
                return documents
                
            # Regular vector search if collection exists
            results = self.collection.query(
                query_texts=[query],
                n_results=top_k
            )
            
            # Create Document objects
            documents = []
            if results and results.get("documents") and results.get("documents")[0]:
                for i, doc_text in enumerate(results["documents"][0]):
                    metadata = results["metadatas"][0][i] if results.get("metadatas") and results["metadatas"][0] else {}
                    
                    # Add distance/score if available
                    score = None
                    if results.get("distances") and results["distances"][0]:
                        score = results["distances"][0][i]
                    
                    documents.append(Document(
                        text=doc_text,
                        metadata=metadata,
                        score=score
                    ))
            
            # Role-based filtering (could be expanded)
            if role != "admin" and role != "faculty":
                # For regular students, filter out admin-only content if needed
                # (This is just a placeholder for role-based access logic)
                pass
                
            return documents
            
        except Exception as e:
            print(f"Error retrieving context: {e}")
            return []

# Add a simple mock embedding model class as a last resort fallback
class MockEmbeddingModel:
    """A simple mock embedding model that returns random embeddings"""
    def __init__(self):
        print("Using mock embedding model - limited functionality")
        
    def encode(self, texts, show_progress_bar=False, batch_size=32, **kwargs):
        """Return random embeddings for texts"""
        if isinstance(texts, str):
            texts = [texts]
        return np.random.rand(len(texts), 384)  # Mimic 384-dimensional embeddings