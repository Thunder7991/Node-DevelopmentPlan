const EventMitter = require('events');

//创建eventEmitter实例

const emitter = new EventMitter();
emitter.on('thunder', () => {
  console.log('监听thunder事件');
});

setTimeout(() => {
  emitter.emit('thunder');
}, 2000);
