// // 自定义 get请求
// import axios from 'axios';

// const Get = (url: string) => {
//   return (target: any, key: any, descriptor: PropertyDecorator) => {
//     const fnc = descriptor.value;
//     axios.get(url).then((res) => {
//       fnc(res, {
//         status: 200,
//         success: true,
//       });
//     });
//   };
// };

// class Controller {
//   constructor() {}
//   @Get('thunderchen')
//   getList(res: any, status: any) {
//     console.log(res.data.result.list);
//   }
// }

// export {};
