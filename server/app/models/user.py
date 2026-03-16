from pydantic import BaseModel
from beanie import Document


class UserCreate(BaseModel):
    email: str
    name: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class User(Document):
    user_id: str
    email: str
    name: str
    password_hash: str

    class Settings:
        name = "users"