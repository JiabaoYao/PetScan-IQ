from app.models.user import User, UserCreate, UserLogin
import uuid
from app.utils.security import PasswordManager


class UserService:
    async def login(self, body: UserLogin):
        user = await User.find_one(User.email == body.email)
        if not user:
            raise ValueError("User not found")
        
        if not PasswordManager.verify_password(body.password, user.password_hash):
            raise ValueError("Incorrect password")
        
        return user.user_id
    
    async def get_user(self, user_id: str):
        user = await User.find_one(User.user_id == user_id)
        if not user:
            raise ValueError("User not found")
        return user

class NewUser:
    async def create_new(self, body: UserCreate):
        existing_user = await User.find_one(User.email == body.email)
        if existing_user:
            raise ValueError("User with this email already exists")

        password_hash = PasswordManager.hash_password(body.password)
        new_user = User(
            user_id=str(uuid.uuid4())[:12],
            email=body.email,
            name=body.name,
            password_hash=password_hash
        )

        await new_user.insert()

        return new_user.user_id        