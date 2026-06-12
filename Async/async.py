import time
import asyncio

async def task_a():
    print("A 시작")
    await asyncio.sleep(2)
    print("A 끝")

async def task_b():
    print("B 시작")
    await asyncio.sleep(2)
    print("B 끝")

async def main():
    await asyncio.gather(task_a(), task_b())

if __name__ == "__main__":
    start = time.time()
    asyncio.run(main())
    end = time.time()
    print(f"총 걸린 시간: {end-start:.2f}초")