import os
import shutil
from fastapi import UploadFile, HTTPException
from app.utils.auth_utils import generate_uuid

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".ppt", ".pptx", ".zip"}

def save_upload_file(upload_file: UploadFile, subfolder: str = "") -> str:
    _, ext = os.path.splitext(upload_file.filename)
    if ext.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File extension {ext} not allowed. Allowed: {ALLOWED_EXTENSIONS}")
    
    target_dir = os.path.join(UPLOAD_DIR, subfolder)
    os.makedirs(target_dir, exist_ok=True)
    
    unique_filename = f"{generate_uuid()}{ext}"
    file_path = os.path.join(target_dir, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not save file")
    finally:
        upload_file.file.close()
        
    # Return a relative URL path (can be served by StaticFiles in FastAPI)
    return f"/static/{subfolder}/{unique_filename}" if subfolder else f"/static/{unique_filename}"

def delete_file(file_url: str):
    if not file_url.startswith("/static/"):
        return
    
    relative_path = file_url.replace("/static/", "")
    file_path = os.path.join(UPLOAD_DIR, relative_path)
    
    if os.path.exists(file_path):
        os.remove(file_path)
