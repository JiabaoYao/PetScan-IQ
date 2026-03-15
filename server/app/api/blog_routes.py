from fastapi import APIRouter, HTTPException
from app.models.blog import Blog, CreateBlogRequest
from app.services.blog_service import BlogService

router = APIRouter()

@router.post("/blogs")
async def create_blog(body: CreateBlogRequest):
    try:
        service = BlogService()
        blog_id = await service.insert_one(body)
        return {"blog_id": blog_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/blogs")
async def get_blogs():
    try:
        service = BlogService()
        blogs = await service.get_all()
        # Return JSON-serializable dicts (Beanie docs can fail to serialize otherwise)
        return [b.model_dump(mode="json") for b in blogs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/blogs/{blog_id}")
async def get_blog(blog_id: str):
    service = BlogService()
    blog = await service.get_by_id(blog_id)
    return blog.model_dump(mode="json") if blog else None

@router.put("/blogs/{blog_id}")
async def update_blog(blog_id: str, body: CreateBlogRequest):
    service = BlogService()
    blog = await service.update_one(blog_id, body.model_dump(exclude_none=True))
    return {"status": "success", "updated": blog is not None}

@router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str):
    service = BlogService()
    deleted = await service.delete_one(blog_id)
    return {"status": "success", "deleted_count": 1 if deleted else 0}