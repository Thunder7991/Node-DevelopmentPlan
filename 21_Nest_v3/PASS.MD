### NestJS 创建一个服务是非常快的

* 安装 @nestjs/cli，使用 nest new xxx 创建一个 Nest 的项目，
* 在根目录执行 nest g resource person 快速生成 person 模块的 crud 代码
* nest start --watch 启动 Nest 服务

### 静态资源

调用useStaticAssets来支持静态资源请求
```js
const app = await NestFacotry.create<NestExpressApplication>(AppModule)

app.useStaticAssets(join(__dirname,'..','public'),{prefix:'/static'})
```
需要再文件的根目录中创建public => index.html

### 请求

#### Params 请求

```js
  @Get('/param/:id')
  urlParam(@Param('id') id: string) {
    return `received: id=${id}`;
  }
```

#### Query请求

```js
  @Get('find')
  query(@Query('name') name: string, @Query('age') age: number) {
    return `received: name=${name}，age=${age}`;
  }
```

#### form urlencoded 请求

用 Nest 接收的话，使用 @Body 装饰器，Nest 会解析请求体，然后注入到 dto 中。

dto 是 data transfer object，就是用于封装传输的数据的对象：

```js
export class CreatePersonDto {
  name: string;
  age: number;
}

@Post()
body(@Body() createPersonDto: CreatePersonDto) {
  return `${JSON.stringify(createPersonDto)}`;
}

```

#### Json请求

同上

#### form data请求

```js
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreatePersonDto } from './dto/create-person.dto';

@Controller('api/person')
export class PersonController {
  @Post('file')
  @UseInterceptors(AnyFilesInterceptor({
      dest: 'uploads/'
  }))
  body2(@Body() createPersonDto: CreatePersonDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return `received: ${JSON.stringify(createPersonDto)}`
  }
}

```



#### 调试

输入命令

```js
node --inspect-brk index.js
```

--inspect 是调试模式运行，--inspect-brk还会再首行断住

可以使用Chrome DevTools 进行调试

在浏览器中输入：

```js
chrome://inspect/#devices
```

![devtools](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230628231918207.png)

点击下方的**inspect**进行调试

在nest项目中同理：

```js
pnpm run start:debug

或者

nest start --debug
```

原理就是 **node --inspect** （不是 -brk）

##### 通过vscode调试

创建launch.json文件，他会再根目录中 .vscode/launch.json 

```js

{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach by Process ID",
            "processId": "${command:PickProcess}",
            "request": "attach",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node"
        },
        //调试JS文件
        {
            "type": "node",
            "request": "launch",
            "name": "启动程序",
            "stopOnEntry": true, //首行断住和 --inspect-brk 一样的效果
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/index.js"
        }
    ]
}
```

对于nest项目先`nest start --debug`启动nest服务，然后根据上述的配置，启动调试即可

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230628235440501.png)



##### vscode第三种

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230629001913443.png)



还有一种是npm scripts ， launch.json配置文件如下：

```js
 {
            "type": "node",
            "request": "launch",
            "name": "debug nest",
            "runtimeExecutable": "npm",
            "args": [
                "run",
                "start:dev",
            ],
            "skipFiles": [
                "<node_internals>/**"
            ],
            "console": "integratedTerminal",
        }
```



选择 `debug nest`启动调试工具

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230629002037490.png)

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230629002100434.png)



> 需要注意的是，此时项目必须和.vscode文件在同一目录下



### AOP框架

**AOP 的好处是可以把一些通用逻辑分离到切面中，保持业务逻辑的纯粹性，这样切面逻辑可以复用，还可以动态的增删。**



实现AOP的方式有很多

**中间件Middleware**

```js
const app = await NestFactory.create(AppModule);
app.use(logger)
await app.listen(3000)
```

针对某个路由来说的，范围更小一些：

```js
export class AppModule implements NestModule {
 configure(consumer:MiddlewareConsumer) {
 	consumer.apply(LoggerMiddleware).forRoutes('cats');
 }
}
```



### Guard

```js
@Injectable()
export class RolesGuard implements CanActivate {
	canActivate(
		context:ExecutionContext,
	):boolean | Promise<boolean> | Observable<boolean>{
	return true
   }
}
```

Guard 要实现 CanActivate 接口，实现 canActivate 方法，可以从 context 拿到请求的信息，然后做一些权限验证等处理之后返回 true 或者 false。

使用

```js
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

全局开启：

```js
const app = await NestFactory.create(AppModole);
app.useGlobalGuard(new RolesGuard());
```

### Interceptor

拦截器

```js
import {Observable} from 'rxjs'
improt {tap} from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor{
	intercept(context:ExectionContext,next:CallHandler):Objservable<any>{
		const now = Date.now()
		return next.handle().pipe(tap(() => console.log()))
	}

}
```

Interceptor 要实现 NestInterceptor 接口，实现 intercept 方法，调用 next.handle() 就会调用目标 Controller，可以在之前和之后加入一些处理逻辑。



作用于单独的路由

```js
@UseInterceptors(new LoggingInterceptor())
export class CatsController {}
```

作用于全局

```js
const app = await NestFactory.create(ApplicationModule);
app.useGlobalInterceptors(new LoggingInterceptor())
```

### Pipe

Pipe 是管道的意思，用来对参数做一些检验和转换：

实现方式

```js
@Injectable()
export class ValidationPipe implements PipeTransform{
	transform(value:any,metadata:ArgumentMetadata) {
		return value;
	}
}
```

9个内置的pipe

- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe
- ParseEnumPipe
- ParseFloatPipe
- ParseFilePipe

针对某个参数

```js
@Controller()
export class AppController {
    constructor(private readonly appService:AppService){}
    @Get()
    hello(@Param('aaa',ParseIntPipe)aaa:number){
        return 'hello'
    }
}
```

针对某个路由

```js
@Post()
@UsePipes(ValidationPipe)
async create(@Body() createCatDto:CreateCatDto) {
	this.catsService.create(createCatDto)
}
```

针对全局

```js
async funciton bootstrap (){
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(new ValidationPipe())
	await app.listen(3000)
}
bootstrap()
```

### ExceptionFilter

ExceptionFilter 可以对抛出的异常做处理，返回对应的响应：

```js
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception:HttpException,host:ArgumentsHost) {
        const ctx= host.switchToHttp();
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        const status = exception.getStatus()
        
        response.status(status).json({
            statusCode:status,
            timestamp:new Date().toISOString(),
            path:request.url
        })
    }
}
```

Nest 内置了很多 http 相关的异常，都是 HttpException 的子类：

- BadRequestException
- UnauthorizedException
- NotFoundException
- ForbiddenException
- NotAcceptableException
- RequestTimeoutException
- ConflictException
- GoneException
- PayloadTooLargeException
- UnsupportedMediaTypeException
- UnprocessableException
- InternalServerErrorException
- NotImplementedException
- BadGatewayException
- ServiceUnavailableException
- GatewayTimeoutException

自己扩展

```js
export class ForbiddenException extends HttpException {
	constructor() {
		super('Forbidden',HttpStatus.FORBIDDEN)
	}
}
```

**Nest 通过这样的方式实现了异常到响应的对应关系，代码里只要抛出不同的异常，就会返回对应的响应，很方便。**

某个路由：

```js
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto:createCatDto) {
    throw new ForbiddenException()
}
```

全局：

```js
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(3000)
}
```



AOP执行顺序：

> 会先调用 Guard，Guard 用于判断路由有没有权限访问，然后会调用 Interceptor，对 Contoller 前后扩展一些逻辑，在到达目标 Controller 之前，还会调用 Pipe 来对参数做检验和转换。所有的 HttpException 的异常都会被 ExceptionFilter 处理，返回不同的响应。


 ### Nest 全部的装饰器

@Module： 声明 Nest 模块
@Controller：声明模块里的 controller
@Injectable：声明模块里可以注入的 provider
@Inject：通过 token 手动指定注入的 provider，token 可以是 class 或者 string
@Optional：声明注入的 provider 是可选的，可以为空
@Global：声明全局模块
@Catch：声明 exception filter 处理的 exception 类型
@UseFilters：路由级别使用 exception filter
@UsePipes：路由级别使用 pipe
@UseInterceptors：路由级别使用 interceptor
@SetMetadata：在 class 或者 handler 上添加 metadata
@Get、@Post、@Put、@Delete、@Patch、@Options、@Head：声明 get、post、put、delete、patch、options、head 的请求方式
@Param：取出 url 中的参数，比如 /aaa/:id 中的 id
@Query: 取出 query 部分的参数，比如 /aaa?name=xx 中的 name
@Body：取出请求 body，通过 dto class 来接收
@Headers：取出某个或全部请求头
@Session：取出 session 对象，需要启用 express-session 中间件
@HostParm： 取出 host 里的参数
@Req、@Request：注入 request 对象
@Res、@Response：注入 response 对象，一旦注入了这个 Nest 就不会把返回值作为响应了，除非指定 passthrough 为true
@Next：注入调用下一个 handler 的 next 方法
@HttpCode： 修改响应的状态码
@Header：修改响应头
@Redirect：指定重定向的 url
@Render：指定渲染用的模版引擎

### Nest初识原理



@Module源码：

```js
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```



![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2bb578b9b624bf993aaedc250ec053d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



### Middleware

Nest 也有 middleware，但是它不是 Express 的 middleware，虽然都有 request、response、next 参数，但是它可以从 Nest 的 IOC 容器注入依赖，还可以指定作用于哪些路由。



用法是 Module 实现 NestModule 的 configure 方法，调用 apply 和 forRoutes 指定什么中间件作用于什么路由。



app.use 也可以应用中间件，但更建议在 AppModule 里的 configure 方法里指定。 (略)



Nest 还有个 @Next 装饰器，这个是用于调用下个 handler 处理的，当用了这个装饰器之后，Nest 就不会把 handler 返回值作为响应了。



middleware 和 interceptor 功能类似，但也有不同，interceptor 可以拿到目标 class、handler 等，也可以调用 rxjs 的 operator 来处理响应，更适合处理具体的业务逻辑。



middleware 更适合处理通用的逻辑。



### rxJS

rxjs 是一个处理异步逻辑的库，它的特点就是 operator 多，你可以通过组合 operator 来完成逻辑，不需要自己写。

nest 的 interceptor 就用了 rxjs 来处理响应，但常用的 operator 也就这么几个：

- tap: 不修改响应数据，执行一些额外逻辑，比如记录日志、更新缓存等
- map：对响应数据做修改，一般都是改成 {code, data, message} 的格式
- catchError：在 exception filter 之前处理抛出的异常，可以记录或者抛出别的异常
- timeout：处理响应超时的情况，抛出一个 TimeoutError，配合 catchErrror 可以返回超时的响应



总之，rxjs 的 operator 多，但是适合在 nest interceptor 里用的也不多。



### Pipe

内置的Pipe有这些：

- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe
- ParseEnumPipe
- ParseFloatPipe
- ParseFilePipe



### class-validator

它的实现原理是基于 class-tranformer 把参数对象转换为 dto class 的对象，然后通过 class-validator 基于装饰器对这个对象做验证。



我们可以自己实现这样的 pipe，pipe 里可以注入依赖。



如果是全局 pipe 想注入依赖，需要通过 APP_PIPE 的 token 在 AppModule 里声明 provider。



class-validator 支持很多种验证规则，比如邮箱、域名、长度、值的范围等，而且错误消息也可以自定义。



### Nest 上传

Nest 的文件上传也是基于 multer 实现的，它对 multer api 封装了一层，提供了 FileInterceptor、FilesInterceptor、FileFieldsInterceptor、AnyFilesInterceptor 的拦截器，分别用到了 multer 包的 single、array、fields、any 方法。



它们把文件解析出来，放到 request 的某个属性上，然后再用 @UploadedFile、@UploadedFiles 的装饰器取出来传入 handler。



并且这个过程还可以使用 ParseFilePipe 来做文件的验证，它内置了 MaxFileSizeValidator、FileTypeValidator，你也可以实现自己的 FileValidator。



这就是 Nest 里处理文件上传的方式。



### 日志

日志打印可以用 Nest 的 Logger，它支持在创建应用的时候指定 logger 是否开启，打印的日志级别，还可以自定义 logger。

自定义 Logger 需要实现 LoggerService 接口，或者继承 ConsoleLogger 然后重写部分方法。

如果想在 Logger 注入一些 provider，就需要创建应用时设置 bufferLogs 为 true，然后用 app.useLogger(app.get(xxxLogger)) 来指定 Logger。

你可以把这个自定义 Logger 封装到全局模块，或者动态模块里。

当然，一般情况下，直接使用 Logger 就可以了。



### Docker

点击nginx run 按钮

```shell
docker run --name nginx-test2 -p 80:80 -v /tmp/aaa:/usr/share/nginx/html -e KEY1=VALUE1 -d nginx:latest 

```

`-p` 是端口映射

`-v` 是指定数据卷挂载目录

`-e` 是指定环境变量

`-d` 是后台运行

`-f ` 指定下 dockefile 的文件名 

`-t` 参数为镜像设置了一个标签 `my-app:latest`。这意味着构建的镜像将被命名为 `my-app`，标签为 `latest`，即表示最新版本的镜像。如果不指定标签，默认为 `latest`

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230719234520463.png)

此时会返回一个容器的hash, 就是 容器中镜像的ID

docker 的命令有很多 , 千万不要死记 , 去官网查询即可.



Docker 可以把环境封装成镜像，镜像跑起来是一个独立的容器。通过这种方式可以快速部署多个相同的实例。

docker 提供了一个 desktop 工具，可以可视化的操作 docker，包括容器、镜像、volume 等

我们 pull 了一个 nginx 镜像下来，指定端口映射、挂载的数据卷，并把它跑起来了。

这就是 docker 的基本用法。

当然，这些可视化的操作都有对应的命令，当服务器上没有桌面的时候，就需要用命令行操作了。

不得不说，用 desktop 来学 docker 真是太简单了。



### Dockerfile

- FROM：基于一个基础镜像来修改
- WORKDIR：指定当前工作目录
- COPY：把容器外的内容复制到容器内
- EXPOSE：声明当前容器要访问的网络端口，比如这里起服务会用到 8080
- RUN：在容器内执行命令
- CMD：容器启动的时候执行的命令



docker 镜像是通过 dockerfile 构建出来的。

我们写了第一个 dockerfile，通过 FROM、WORKDIR、COPY、RUN、EXPOSE、CMD 等指令声明了一个 http-server 提供静态服务的镜像。

docker run 这个镜像就可以生成容器，指定映射的端口、挂载的数据卷、环境变量等。

VOLUME 指令看起来没啥用，但能保证你容器内某个目录下的数据一定会被持久化，能保证没挂载数据卷的时候，数据不丢失。



### Nest项目如何编写Dockerfile

docker build 的时候会把构建上下文的所有文件打包发送给 docker daemon 来构建镜像。

可以通过 .dockerignore 指定哪些文件不发送，这样能加快构建时间，减小镜像体积。

此外，多阶段构建也能减小镜像体积，也就是 build 一个镜像、production 一个镜像，最终保留下 production 的镜像。

而且我们一般使用 alpine 的基础镜像，类似 node:18.10-aline3.14，这样构建出来镜像体积会小很多。

这就是用 Nest 项目构建 Docker 镜像的方式。



案例:

```shell
docker run -p 3000:3000 -v /aaa:/bbb/ccc --name xxx-container xxx-image
```

通过 xxx-image 镜像跑起来一个叫做 xxx-container 的容器。

-p 指定端口映射，映射宿主机的 3000 到容器的 3000 端口。

-v 指定数据卷挂载，挂载宿主机的 /aaa 到容器的 /bbb/ccc 目录。

这个镜像是通过 Dockerfile 经过 build 产生的。

![流程如下](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230720234716645.png)

基本 CI/CD 也是这样的流程：

CI 的时候 git clone 项目，根据 dockerfile 构建出镜像，打上 tag，push 到仓库。

CD 的时候把打 tag 的镜像下下来，docker run 跑起来。

这个 Dockerfile 是在项目里维护的，虽然 CI/CD 流程不用自己搞，但是 Dockefile 还是要开发者自己写的。



### 使用多阶段构建



详见dockerfile-test



### 使用 ARG 增加构建灵活性

构建

```shell
docker build --build-arg aaa=3 --build-arg bbb=4 -t arg-test -f ARG.dockerfile .
```

运行

```shell
docker run  --name fourth-container arg-test
```



### CMD 结合 ENTRYPOINT



```dockerfile
FROM node:18-alpine3.14

CMD ["echo", "thunder", "到此一游"]
# thunder 到此一游
```



用 CMD 的时候，启动命令是可以重写的：

```shell
docker run cmd-test echo "chen"
```

会替换成 chen 



可以替换成任何命令。

而用 ENTRYPOINT 就不会：

```dockerfile
FROM node:18-alpine3.14

ENTRYPOINT ["echo", "thunderchen", "到此一游"]
```

```shell
docker run cmd-test echo "chen"
```

打印:  thunderchen 到此一游   chen

ENTRYPOINT 和 CMD 是可以结合使用的。

```shell
FROM node:18-alpine3.14

ENTRYPOINT ["echo", "thunder"]

CMD ["chen"]
```

```shell
docker run cmd-test
docker run cmd-test 66666
```

thunder chen

thunder 66666

### COPY vs ADD

```dockerfile
FROM node:18-alpine3.14

ADD ./aaa.tar.gz /aaa

COPY ./aaa.tar.gz /bbb
```

ADD 把 tar.gz 给解压然后复制到容器内

COPY 没有解压，它把文件整个复制过去



Docker 是流行的容器技术，它可以在操作系统上创建多个隔离的容器，在容器内跑各种服务。

它的流程是 Dockerfile 经过 docker build 生成 docker 镜像，然后 docker run 来跑容器。

docker run 的时候可以通过 -p 指定宿主机和容器的端口映射，通过 -v 挂载数据卷到容器内的某个目录。

CI/CD 基本也是这套流程，但是 Dockerfile 是要开发者自己维护的。

Dockerfile 有挺多技巧：

- 使用 alpine 的镜像，而不是默认的 linux 镜像，可以极大减小镜像体积，比如 node:18-alpine3.14 这种
- 使用多阶段构建，比如一个阶段来执行 build，一个阶段把文件复制过去，跑起服务来，最后只保留最后一个阶段的镜像。这样使镜像内只保留运行需要的文件以及 dependencies。
- 使用 ARG 增加构建灵活性，ARG 可以在 docker build 时通过 --build-arg xxx=yyy 传入，在 dockerfile 中生效，可以使构建过程更灵活。如果是想定义运行时可以访问的变量，可以通过 ENV 定义环境变量，值使用 ARG 传入。
- CMD 和 ENTRYPOINT 都可以指定容器跑起来之后运行的命令，CMD 可以被覆盖，而 ENTRYPOINT 不可以，两者结合使用可以实现参数默认值的功能。
- ADD 和 COPY 都可以复制文件到容器内，但是 ADD 处理 tar.gz 的时候，还会做一下解压。

灵活使用这些技巧，可以让你的 Dockerfile 更加灵活、性能更好。





### Docker实现原理



Docker 的实现原理依赖 linux 的 Namespace、Control Group、UnionFS 这三种机制。

Namespace 做资源隔离，Control Group 做容器的资源限制，UnionFS 做文件系统的镜像存储、镜像合并。

我们通过 dockerfile 描述镜像构建的过程，每一条指令都是一个镜像层。

镜像通过 docker run 就可以跑起来，对外提供服务，这时会添加一个可写层（容器层）。

挂载一个 volume 数据卷到 Docker 容器，就可以实现数据的持久化。

这就是 Docker 的实现原理。



### PM2

#### 安装:

```shell
npm install -g pm2
```

#### Run:

```shell
pm2 start ./dist/main.js
```

![start](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230722155727013.png)

#### 日志:

```shell
pm2 logs
//或者 查询单个进程
pm2 logs 进程名
pm2 logs 进程id

```

![logs](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230722155800982.png)

#### 超过N M内存自动重启

```shell
pm2 start xxx --max-memory-restart 200M
```

#### 从 2s 开始每 3s 重启一次：

```shell
pm2 start xxx --cron-restart "2/3 * * * *"
```

#### 当文件内容改变自动重启：

```shell
pm2 start xxx --watch
```

#### 不自动重启：

```shell
pm2 start xxx  --no-autorestart
```

#### 删除进程:

```shell
pm2 delete 0
```

![delete](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230722162531301.png)



#### 查看 main 进程的前 100 行日志：

```shell
pm2 logs main --lines 100 
```



#### 日志清空

```shell
pm2 flush
```

#### pm2 stop pm2 restart ... 



#### pm2 负载均衡

```shell
pm2 start app.js -i max
pm2 start app.js -i 0
```

 -i num 就是启动 num 个进程做负载均衡的意思。

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230722164805680.png)



 调整数量

```shell
pm2 scale main 3
pm2 scale main +3
```



#### 性能监控

```shell
pm2 monit
```

![monit](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230722164950181.png)



#### pm2 配置文件  Ecosystem

创建文件

```shell
 pm2 ecosystem
```



#### 总结

服务器上的 node 应用需要用 pm2 的日志管理、进程管理、负载均衡、性能监控等功能。

分别对应 pm2 logs、pm2 start/restart/stop/delete、pm2 start -i、pm2 monit 等命令。

多个应用或者想把启动选项保存下来的时候，可以通过 ecosystem 配置文件，批量启动一系列应用。

我们会把 docker 和 pm2 结合起来，在进程崩溃的时候让 pm2 来自动重启。

只要写 dockerfile 的时候多安装一个 pm2 的依赖，然后把 node 换成 p2-runtime 就好了。

不管是出于稳定性、性能还是可观测性等目的，pm2 都是必不可少的。



#### MySQL in Docker



 [MySQL GUI](https://dev.mysql.com/downloads/workbench/)



Docker 基础配置

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230722193916321.png)

数据所在docker位置

/var/lib/mysql

![mysql](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230722194010360.png)
