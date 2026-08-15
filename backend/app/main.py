from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.auth.router import router as auth_router
from app.api.endpoints.admin import router as admin_router
from app.api.endpoints.academic import router as academic_router
from app.api.endpoints.operations import router as operations_router
from app.api.endpoints.extras import router as extras_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS must be registered BEFORE routers.
# allow_origins=["*"] cannot be combined with allow_credentials=True — use explicit origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(admin_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(academic_router, prefix=f"{settings.API_V1_STR}/academic", tags=["academic"])
app.include_router(operations_router, prefix=f"{settings.API_V1_STR}/operations", tags=["operations"])
app.include_router(extras_router, prefix=f"{settings.API_V1_STR}/extras", tags=["extras"])

os.makedirs("uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="uploads"), name="static")

@app.get("/")
def root():
    return {"message": "Welcome to Student Information System API"}
