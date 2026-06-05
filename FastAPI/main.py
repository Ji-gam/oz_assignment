# $env:PYTHONUTF8=1; .venv\Scripts\fastapi dev

from sqlalchemy.ext.asyncio import session
from fastapi import FastAPI, Path, Query, HTTPException, Depends, Body
from sqlalchemy import select

from orm import Item
from database import get_session
from llama import llm, SYSTEM_PROMPT
from schema import ItemCreateRequest, ItemResponse, ItemUpdateRequest

app = FastAPI()

# HTTP 요청
# 1) 행위: HTTP Method
# 2) 자원: Path

# Get google.com/users

# 서버(백엔드)

@app.post(
    "/chat",
    summary="Llama 응답 생성 API"
)
def create_chat_completion(
    user_input: str = Body(..., embed=True),
):
    result = llm.create_chat_completion(
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_input},
        ],
        max_tokens = 256,
        temperature = 0.7,
    )

    answer = result["choices"][0]["message"]["content"]
    return {"answer": answer}


items = [
        {"id": 1, "name":"apple", "price": 100},
        {"id": 2, "name":"banana", "price": 200},
        {"id": 3, "name":"cheery", "price": 300},
    ]

@app.get(
    "/items",
    summary="전체 상품 목록 조회 API",
    response_model=list[ItemResponse],
)
def get_items_handler(session = Depends(get_session)):
    stmt = select(Item) # SELECT * FROM item
    result = session.execute(stmt)
    items = result.scalars().all() # [Item(id=1, name='apple', price=100), Item(id=2, name='banana', price=200)]
    return items

@app.get(
    "/items/{item_id}",
    summary="단일 상품 조회 API",
    response_model=ItemResponse,
)
def get_item_handler(
    # Grater or Equal to = ~ 이상
    item_id: int = Path(..., ge=1, description="상품 고유번호"),
    session = Depends(get_session),
    ):
    stmt = select(Item).where(Item.id == item_id)
    result = session.execute(stmt)
    item : Item | None = result.scalar()
    if item is None:
        raise HTTPException(
            status_code=404, detail="Item Not Found"
            )
    return item

    for item in items:
        if item["id"] == item_id:
            return item
    
    # 찾고자 하는 상품이 없을 때
    raise HTTPException(
        status_code=404,
        detail="Item Not Found",
    )

@app.post(
    "/items",
    summary="새로운 상품 등록 API",
    response_model=ItemResponse,
)
def create_item_handler(
    body: ItemCreateRequest,
    session = Depends(get_session),
):
    new_item = Item(
        name = body.name,
        price = body.price
        )
    session.add(new_item)
    session.commit()
    return new_item

@app.patch(
    "/items/{item_id}",
    summary="상품 수정 API",
    response_model=ItemResponse,
)

def update_item_handler(
    item_id: int,
    body: ItemUpdateRequest,
    session = Depends(get_session),
    ):
    # 1) 수정할 데이터 검증
    # 2) 수정할 상품 조회
    # 3) 데이터 수정 & 조회
    stmt = select(Item).where(Item.id==item_id)
    result = session.execute(stmt)
    item: Item | None = result.scalar()
    if item is None:
        raise HTTPException(
            status_code=404, detail="Item Not Found"
            )
    if body.name is not None:
        item.name = body.name
    if body.price is not None:
        item.price = body.price
    session.commit()
    return item


@app.delete(
    "/items/{item_id}",
    summary="상품 삭제 API",
    status_code=204,
    response_model=None,
)
def delete_item_handler(item_id: int, session = Depends(get_session),):
    stmt = select(Item).where(Item.id == item_id)
    result = session.execute(stmt)
    item = result.scalar()
    if item is None:
            raise HTTPException(
                status_code=404, detail = "Item Not Found"
            )
    session.delete(item)
    session.commit()
    return
        