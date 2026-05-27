// 함수(Function)

function add(n1, n2) {
    console.log(n1);
    return n1 + n2;
}

const f = add(1, 2);
console.log(f);

function run(fn) {
    return fn(2, 3)
}

run()