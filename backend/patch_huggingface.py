import sys
import importlib
import huggingface_hub
import os

# Create a proper compatibility wrapper for cached_download
def patched_cached_download(url=None, cache_dir=None, force_download=False, 
                          proxies=None, etag_timeout=None, resume_download=False, 
                          use_auth_token=None, local_files_only=False, 
                          legacy_cache_layout=None, **kwargs):
    
    # Filter out unsupported parameters
    filtered_kwargs = {k: v for k, v in kwargs.items() 
                      if k not in ['legacy_cache_layout']}
    
    # Convert URL to repo_id and filename if possible
    if url is not None:
        if 'huggingface.co' in url:
            try:
                parts = url.split('/')
                if len(parts) >= 5:
                    repo_id = f"{parts[-3]}/{parts[-2]}"
                    filename = parts[-1]
                    return huggingface_hub.hf_hub_download(
                        repo_id=repo_id,
                        filename=filename,
                        cache_dir=cache_dir,
                        force_download=force_download,
                        proxies=proxies,
                        resume_download=resume_download,
                        token=use_auth_token,
                        local_files_only=local_files_only,
                        **filtered_kwargs
                    )
            except Exception as e:
                print(f"Error parsing URL: {e}")
    
    # If we can't handle the URL format, try a more direct approach
    # Get the model name from environment or use a default
    repo_id = os.environ.get('HF_MODEL_ID', 'sentence-transformers/all-MiniLM-L6-v2')
    filename = os.path.basename(url) if url else "model.safetensors"
    
    return huggingface_hub.hf_hub_download(
        repo_id=repo_id,
        filename=filename,
        cache_dir=cache_dir,
        force_download=force_download,
        proxies=proxies,
        resume_download=resume_download,
        token=use_auth_token,
        local_files_only=local_files_only,
        **filtered_kwargs
    )

# Add cached_download compatibility
huggingface_hub.cached_download = patched_cached_download

# Apply the patch to sys.modules to ensure it's visible everywhere
sys.modules['huggingface_hub'] = huggingface_hub