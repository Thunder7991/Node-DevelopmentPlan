## NestJS 命令行

查看命令
```shell
nest
```
#### 执行顺序
1. 创建模型

```shell
nest g mo video 
```
2. 创建控制器
   
```shell
nest g co video
```
3. 创建业务逻辑层
   
```shell
nest g s video
```

> 请严格按照上面顺序安装模块, 否则根目录下的app.module相关配置会出现异常


#### 快捷创建CRUD模板

```shell
nest g res users
```
```shell
?What transport layer do you use? REST API
? Would you like to generate CRUD entry points? Yes
```






