import os
import bcrypt
from datetime import datetime
from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel, EmailStr

# 1. إعداد قاعدة البيانات SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app_data.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. نماذج قاعدة البيانات (Database Models)

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class FeedbackModel(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=True)
    prompt = Column(Text, nullable=False)
    code_generated = Column(Text, nullable=True)
    is_liked = Column(Boolean, nullable=False)
    feedback_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 3. مخططات البيانات (Pydantic Schemas)

class UserSignUp(BaseModel):
    full_name: Optional[str] = None
    email: EmailStr
    password: str

class UserSignIn(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: Optional[str]
    email: str

    class Config:
        from_attributes = True

# 4. التشفير والمصادقة

def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)

def register_user(db: Session, user_data: UserSignUp) -> Optional[UserModel]:
    existing_user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
    if existing_user:
        return None
    
    hashed_pwd = hash_password(user_data.password)
    new_user = UserModel(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, user_data: UserSignIn) -> Optional[UserModel]:
    user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
    if not user:
        return None
    if not verify_password(user_data.password, user.hashed_password):
        return None
    return user