console.log(process.env.NODE_ENV);
require('dotenv').config({
    // path:'./.env'
    path: process.env.NODE_ENV === 'production' ? './production.env' : './.env',
})
// console.log(4,process.env);

console.log('aaa', process.env.aaa);
console.log('bbb', process.env.bbb)