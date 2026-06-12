import asyncio


async def hello():
    await asyncio.sleep(3)
    print("hello")