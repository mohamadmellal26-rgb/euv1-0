import os
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from auth import (
    get_db, 
    register_user, 
    authenticate_user, 
    UserSignUp, 
    UserSignIn, 
    UserResponse,
    FeedbackModel
)

load_dotenv()

PORT = int(os.getenv("PORT", 8080))
SECRET_API_KEY = os.getenv("SECRET_API_KEY", "96fd6333c1305c283760466c22c149aae7f868b1dbf6ada2aae78a1444e3cc4c")

# تحديد المصادر المسموحة بدقة لدعم Vercel والتطوير المحلي
raw_origins = os.getenv("ALLOWED_ORIGINS", "")
parsed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

default_origins = [
    "https://euv-1-0.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
]

origins = parsed_origins if parsed_origins else default_origins

app = FastAPI(title="Auth & Database Backend Server")

# إصلاح إعدادات CORS لمنع خطأ 400 Bad Request
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True if origins and origins != ["*"] else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_api_key(api_key: str = Depends(api_key_header)):
    if SECRET_API_KEY and api_key != SECRET_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Invalid or missing API Key"
        )
    return api_key

class FeedbackPayload(BaseModel):
    prompt: str
    code_generated: Optional[str] = ""
    is_liked: bool
    feedback_notes: Optional[str] = None
    user_email: Optional[str] = None

# ----------------- فحص صحة السيرفر -----------------

@app.get("/")
def health_check():
    return {"status": "online", "message": "Backend server is running successfully"}

# ----------------- مسارات المصادقة (Auth Routes) -----------------

@app.post("/auth/signup", response_model=UserResponse)
def signup(payload: UserSignUp, db: Session = Depends(get_db)):
    user = register_user(db, payload)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
    return user

@app.post("/auth/signin")
def signin(payload: UserSignIn, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email
        }
    }

# ----------------- مسار التغذية الراجعة -----------------

@app.post("/feedback", dependencies=[Depends(verify_api_key)])
def submit_feedback(payload: FeedbackPayload, db: Session = Depends(get_db)):
    new_feedback = FeedbackModel(
        user_email=payload.user_email,
        prompt=payload.prompt,
        code_generated=payload.code_generated,
        is_liked=payload.is_liked,
        feedback_notes=payload.feedback_notes
    )
    db.add(new_feedback)
    db.commit()
    return {"status": "success", "message": "Feedback saved to database"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)