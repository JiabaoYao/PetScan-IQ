from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
from beanie import Document

class Reply(BaseModel):
    blog_id: str
    comment_id: str
    reply_id: str
    content: str
    author: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    likes: int

class Comment(BaseModel):
    blog_id: str
    comment_id: str
    content: str
    author: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    likes: int
    replies: list[Reply]

class CreateBlogRequest(BaseModel):
    """Request body for creating a blog (matches frontend Post shape)."""
    blog_id: Optional[str] = None  # optional; backend can generate
    author: str = "You"
    content: str
    title: Optional[str] = None
    image: Optional[str] = None
    likes: int = 0


class Blog(Document):
    blog_id: str
    title: str = ""
    content: str
    author: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    image: str = ""
    likes: int = 0
    comments: list[Comment] = []

    class Settings:
        name = "blogs"