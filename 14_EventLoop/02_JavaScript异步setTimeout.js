const message = "Hello World";

console.log(message);

function sum(num1, num2) {
  return num1 + num2;
}

function foo() {
  const result = sum(20, 30);
  console.log(result);
}

setTimeout(() => {
  console.log("setTimeout");
}, 1000);

foo();
