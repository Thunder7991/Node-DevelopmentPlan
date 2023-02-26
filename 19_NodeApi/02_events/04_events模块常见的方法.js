const EventMitter = require("events")

const em = new EventMitter()

em.on("thunder",(count) =>{
console.log("thunder监听器",count);
})

em.on("chen",() =>{
    
})

em.on("clearlove",() =>{
    
})

//获取所有监听事件的名称
console.log(em.eventNames());

//获取个数
console.log(em.getMaxListeners());


em.emit("thunder",1)

//监听一次
em.once("thunder",()=>{
    console.log("事件只监听一次");
})
em.emit("thunder",2)
em.emit("thunder",3)

//获取某个事件的监听器个数
console.log(em.listenerCount("thunder"));