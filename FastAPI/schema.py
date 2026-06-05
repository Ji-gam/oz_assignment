# Item 생성 요청 데이터 구조
from pydantic.main import BaseModel

class ItemCreateRequest(BaseModel):
    name: str
    price: int

# Item 응답 데이터 구조
class ItemResponse(BaseModel):
    id: int
    name: str
    price: int

class ItemUpdateRequest(BaseModel):
    name: str | None = None
    price: int | None = None