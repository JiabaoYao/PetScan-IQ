import uuid
from app.models.blog import Blog, CreateBlogRequest


class BlogService:
    async def insert_one(self, body: CreateBlogRequest) -> str:
        blog_id = body.blog_id or str(uuid.uuid4())[:12]
        blog = Blog(
            user_id=body.user_id,
            blog_id=blog_id,
            title=body.title or "",
            content=body.content,
            author=body.author,
            image=body.image or "",
            likes=body.likes,
        )
        await blog.insert()
        return blog_id

    async def get_all(self):
        return await Blog.find().to_list()

    async def get_by_id(self, blog_id: str):
        return await Blog.find_one(Blog.blog_id == blog_id)

    async def update_one(self, blog_id: str, update_data: dict):
        blog = await Blog.find_one(Blog.blog_id == blog_id)
        if not blog:
            return None
        for key, value in update_data.items():
            if hasattr(blog, key):
                setattr(blog, key, value)
        await blog.save()
        return blog

    async def delete_one(self, blog_id: str):
        blog = await Blog.find_one(Blog.blog_id == blog_id)
        if blog:
            await blog.delete()
            return True
        return False
