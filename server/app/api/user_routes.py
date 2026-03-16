from fastapi import APIRouter, HTTPException
from app.models.user import User, UserCreate, UserLogin
from app.services.user_service import UserService, NewUser

router = APIRouter()

@router.post("/users/login")
async def login(body: UserLogin):
    try:
        service = UserService()
        user_id = await service.login(body)
        return {"token": user_id}  # In a real app, you'd return a JWT or similar token
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/users/signup")
async def signup(body: UserCreate):
    print("signup")
    print(body.model_dump(exclude_none=True))
    try:
        service = NewUser()
        user_id = await service.create_new(body)
        return {"token": user_id, "user_id": user_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/users/me")
async def get_user(user_id: str):
    try:
        service = UserService()
        user = await service.get_user(user_id)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))