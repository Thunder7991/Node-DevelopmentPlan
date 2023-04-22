const EventMitter = require('events');

//创建eventEmitter实例

const emitter = new EventMitter();
emitter.on('thunder', (name,age,height) => {
  console.log('监听thunder事件',name,age,height);
});

setTimeout(() => {
  emitter.emit('thunder',"chen",18,1.88);

  //取消
  emitter.off("thunder",()=>{
    console.log("取消了");
  })
  setTimeout(() => {
    emitter.emit("thudner")
  },1000)
}, 2000);
