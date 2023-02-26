# Events模块

- Node中的核心API都是基于异步事件驱动的:
  - Node中的核心体系,某些对象(发射器(Emitters))发出某一个事件;
  - 可以监听这个事件(监听器 Listeners) , 并且传入的回调函数, 这个回调函数会在监听到事件时调用;
- 发出事件监听时间都是通过EventEmitter类来完成的, 它们都属于events对象.
  - emitter.on(eventName,listener): 监听事件, 也可以使用addListener;
  - emitter.off(eventName,listener): 移除事件监听, 也可以使用removeListener;
  - emitter.emit(eventName,[...args]): 发出事件,可以携带一些参数;



## 常见方法

- **emitter.eventNames()**: 返回当前EventEmitter对象注册的事件字符串数组;
- **emitter.getMaxListeners**(): 返回当前EventEmitter对象的最大监听器数量 , 可以通过**setMaxListeners**来修改, 默认是10;
- **emitter.listenerCount(事件名称)**: 放回当前EventEmitter对象某一个事件名称. 监听器的个数;
- **emitter.listeners(事件名称)**: 返回当前EventEmitter对象某个事件监听器上所有的监听器数组;
- **emitter.once(eventName,listener)**: 事件监听一次;
- **emitter.prependListener()**:将监听时间添加到最前面
- **emitter.prependOnceListener()**: 将监听时间添加到最前面, 但是只监听一次
- **emitter.removeAllListeners()**: 移除所有事件. 在**传递参数**的情况下会移除当前事件名称的所有事件, 在**不传递**情况下,会移除所有事件.

