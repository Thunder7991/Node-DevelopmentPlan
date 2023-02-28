## Buffer的创建过程

​		事实上我们创建Buffer时, 并不会频繁的向操作系统申请内存,它会默认先申请一个**8*1024**个字节大小的内存,也就是8Kb。

![部分源码](./buffer.jpg)



## Buffer.from源码

![Buffer.from](./bufferfrom.jpg)

## fromString源码

![fromString](./fromstring.jpg)

> 默认是 utf-8 源码

## fromStringFast 源码

![fromStringFast](./fromStringFast.jpg)

如果内存8kb够用需要将内存偏移

![fsf](./fsf02.jpg)