import asyncio

# 코루틴 함수 정의
async def hello():
    print("hello")

# 일반 함수: 호출 -> 실행
# 코루틴 함수: 호출 -> 객체 -> 실행
coroutine = hello()
asyncio.run(coroutine)