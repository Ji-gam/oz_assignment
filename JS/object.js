// 객체(Object)

let user = {
    name: "alex",
    age: 30
}

console.log(user.nmae);
console.log(user["age"]);

for (const key in user) {
    console.log(key, user[key]);
}