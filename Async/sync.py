import time

def task_a():
    print("A 시작")
    time.sleep(2)
    print("A 끝")

def task_b():
    print("B 시작")
    time.sleep(2)
    print("B 끝")

if __name__ == "__main__":
    start = time.time()

    task_a()
    task_b()

    end = time.time()
    print(f"총 걸린 시간: {end-start:.2f}초")