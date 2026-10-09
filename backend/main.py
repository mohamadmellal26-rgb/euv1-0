import os
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from sqlalchemy.orm import Session

# استيراد من الخدمات المنفصلة
from ai_service import generate_react_code
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
SECRET_API_KEY = os.getenv("SECRET_API_KEY", "my_super_secret_token_12345")
ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "").split(",") if origin.strip()]

app = FastAPI(title="Fast CPU AI Code Generator Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_api_key(api_key: str = Depends(api_key_header)):
    if SECRET_API_KEY and api_key != SECRET_API_KEY:
        raise HTTPException(status_code=403, detail="Access Denied")
    return api_key


class FeedbackPayload(BaseModel):
    prompt: str
    code_generated: Optional[str] = ""
    is_liked: bool
    feedback_notes: Optional[str] = None
    user_email: Optional[str] = None


class GeneratePayload(BaseModel):
    prompt: str

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

# ----------------- مسارات الذكاء الاصطناعي والتغذية الراجعة -----------------

@app.post("/feedback", dependencies=[Depends(verify_api_key)])
def submit_feedback(payload: FeedbackPayload, db: Session = Depends(get_db)):
    # حفظ الملاحظة مباشرة في الداتابيز
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


@app.post("/generate", dependencies=[Depends(verify_api_key)])
def generate_code(payload: GeneratePayload):
    if not payload.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required")

    return generate_react_code(payload.prompt)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)