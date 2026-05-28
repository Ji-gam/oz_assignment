// setTimeout
// 일정 시간이 지나면, 어떤 함수를 실행할 수 있게 하는 함수

// (함수, timeout 시간)
// setTimeout(
//     () => {
//         const ctx = new AudioContext();

//         const osc = ctx.createOscillator();
//         osc.type = "sine";
//         osc.frequency.value = 440;

//         osc.connect(ctx.destination);
//         osc.start();
//     },
//     3000 // 1 ms = 1/1000 s
//     );

let count = 0;

const timerId = setInterval(
    () => {
        count++;

        if (count == 6) {
            clearInterval(timerId);
        };

        console.log(count + '번째 호출');
    }, 1000
);