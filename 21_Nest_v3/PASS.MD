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



### MySQL in Docker



 [MySQL GUI](https://dev.mysql.com/downloads/workbench/)



Docker 基础配置

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230722193916321.png)

数据所在docker位置

/var/lib/mysql

![mysql](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230722194010360.png)



### MYsql 小试牛刀



查询:

```sql
SELECT name, score FROM student;

#之前 select * 是查询所有列的意思,可以通过 as 修改返回的列名：
SELECT name as "名字",score as "分数" FROM student;

#查询自然是可以带条件的，通过 where：
SELECT name as "名字" , class as "班级" from student where age>=19;

#条件可以是and连接的多个:
SELECT name as "名字",class as "班级" from student WHERE gender="男" and score >= 90;

#以用 LIKE 做模糊查询, 比如查询名字以“王”开头的学生：
SELECT * from student WHERE name LIKE "王%";

#通过 in 来指定一个集合：
SELECT * from student WHERE class in ("一班","二班");

#也可以 not in：
SELECT * from student WHERE class not in ("一班","二班");

#通过 between and 来指定一个区间：
SELECT * FROM student WHERE age BETWEEN 18 AND 20;

#返回的数量太多，可以分页返回，这个是通过 limit 实现的,比如从 0 开始的 5 个：
SELECT * FROM student LIMIT 0,5; 
#或者
SELECT * FROM student LIMIT 5;

#通过 order by 来指定排序的列：
#ASC 升序 , DESC 降序.
SELECT name,score,age, FROM  student ORDER BY score ASC,age DESC;

#分组统计, 比如统计每个班级的平均成绩：
#根据班级来分组是 GROUP BY class,求平均成绩使用 sql 内置的函数 AVG(),之后根据平均成绩来降序排列。
SELECT calss as "班级" ,AVG(score) AS "平均成绩" FROM student GROUP BY "平均成绩" DESC;

#还有count
# count(*) 代表当前行
SELECT class,count(*) as count FROM student GROUP BY class;

#分组统计之后还可以做进一步的过滤，但这时候不是用 where 了，而是用 having：
SELECT class,AVG(score) as avg_score FROM student GROUP BY class HAVING avg_score > 90;

#用 distinct 去重：
SELECT DISTINCT class FROM student;
```

![as](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723005749186.png)

![limit 0,5](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723010749089.png)



![count](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723011658441.png)

### 聚合函数

用于对数据的统计，比如 AVG、COUNT、SUM、MIN、MAX。

```sql
SELECT avg(score) as "平均成绩" , count(*) as "人数",sum(score) as "总成绩",min(score) as "最低分", max(score) as "最高分" from student;
```

![聚合函数](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723012453078.png)

### 字符串函数

对字符串的处理，比如 CONCAT、SUBSTR、LENGTH、UPPER、LOWER。



```sql
SELECT CONCAT('xx',name,'yy'),SUBSTR(name,2,3),LENGTH(name),UPPER('aa'),LOWER('TT') FROM student;
```

![字符串函数](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723012725632.png)



### 数值函数



用于对数值的处理，比如 ROUND、CEIL、FLOOR、ABS、MOD。



ROUND 四舍五入、CEIL 向上取整、FLOOR 向下取整、ABS 绝对值、MOD 取模。



```sql
SELECT ROUND(1.23455,2),CETL(1.234345),FLOOR(2.3243434),ABS(-1.5454545),MOD(5,2);
```



![数值函数](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723013830282.png)



### 日期函数  



对日期、时间进行处理，比如 DATE、TIME、YEAR、MONTH、DAY

```sql
SELECT YEAR('2023-06-01 22:06:03'), MONTH('2023-06-01 22:06:03'),DAY('2023-06-01 22:06:03'),DATE('2023-06-01 22:06:03'), TIME('2023-06-01 22:06:03');
```

![日期函数](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723013920578.png)



### 条件函数



根据条件是否成立返回不同的值，比如 IF、CASE

if 函数适合单个条件，case 适合多个条件。

if 和 case 函数和 js 里的 if、swtch 语句很像，很容易理解。

```sql
SELECT name,IF(score>=60,"及格","不及格") FROM student;


SELECT name, score, CASE WHEN score >=90 THEN '优秀' WHEN score >=60 THEN '良好'ELSE '差' END AS '档次' FROM student;
```

![条件函数](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723014036094.png)



### **系统函数**

用于获取系统信息，比如 VERSION、DATABASE、USER。

```sql
select VERSION(), DATABASE(), USER()
```

![system function](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723014258298.png)



### 其他函数 



NULLIF、COALESCE、GREATEST、LEAST。



#### NULLIF

如果相等返回 null，不相等返回第一个值。



```sql
SELECT NULLIF(1,1),NULLIF(1,2);
```

![NULLIF](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723014445488.png)



#### COALESCE

返回第一个非 null 的值：

```sql
SELECT COALESCE(null,1),COALESCE(null,null,2);
```

![COALESCE](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723014616799.png)



#### GREATEST、LEAST

返回几个值中最大最小的。



```sql
SELECT GREATEST(1,2,3),LEAST(1,2,3,4,5);
```

![最大,最小](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723014736182.png)



#### **类型转换函数**



转换类型为另一种，比如 CAST、CONVERT、DATE_FORMAT、STR_TO_DATE。



```sql
SELECT GREATEST(1,CONVERT('123',signed),3);

SELECT GREATEST(1,CAST('123' AS signed),3);

```

![CAST_CONVERT](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723015236971.png)

这里可以转换的类型有这些：

- signed：整型；
- unsigned：无符号整型
- decimal：浮点型；
- char：字符类型；
- date：日期类型；
- time：时间类型；
- datetime：日期时间类型；
- binary：二进制类型



 STR_TO_DATE 和 DATE_FORMAT 



```sql
SELECT STR_TO_DATE('2023-06-01', '%Y-%m-%d');
```

![STR_TO_DATE](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723015428205.png)



#### 总结

我们连接 mysql 数据库，建了张 student 表，插入了一些数据，然后用这些数据来练习了各种查询语法和函数。

- **where**：查询条件，比如 where id=1
- **as**：别名，比如 select xxx as 'yyy'
- **and**: 连接多个条件
- **in/not in**：集合查找，比如 where a in (1,2)
- **between and**：区间查找，比如 where a between 1 and 10
- **limit**：分页，比如 limit 0,5
- **order by**：排序，可以指定先根据什么升序、如果相等再根据什么降序，比如 order by a desc,b asc
- **group by**：分组，比如 group by aaa
- **having**：分组之后再过滤，比如 group by aaa having xxx > 5
- **distinct**：去重

sql 还可以用很多内置函数：

- 聚合函数：avg、count、sum、min、max
- 字符串函数：concat、substr、length、upper、lower
- 数值函数：round、ceil、floor、abs、mod
- 日期函数：year、month、day、date、time
- 条件函数：if、case
- 系统函数：version、datebase、user
- 类型转换函数：convert、cast、date_format、str_to_date
- 其他函数：nullif、coalesce、greatest、least

灵活掌握这些语法，就能写出各种复杂的查询语句。



### 关联查询

```sql
SELECT * FROM user JOIN id_card ON user.id = id_card.user_id;
#全称是INNER JOIN ON
#隐藏user_id
SELECT user.id,name,id_card.id as card_id,card_name FROM user JOIN id_card ON user.id = id_card.user_id;

#LEFT JOIN 是额外返回左表中没有关联上的数据。
#RIGHT JOIN 是额外返回右表中没有关联上的数据。

SELECT user.id,name,id_card.id as card_id,card_name FROM user RIGHT JOIN id_card ON user.id = id_card.user_id;

SELECT user.id , name,id_card.id as card_id , card_name FROM user LEFT JOIN  id_card ON user.id = id_card.user_id;

```

![JOIN ON](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723115338462.png)

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723115420330.png)



![Right Join](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723125938135.png)

![Left join](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723130050063.png)



#### 关联表更新和删除



- CASCADE： 主表主键更新，从表关联记录的外键跟着更新，主表记录删除，从表关联记录删除
- SET NULL：主表主键更新或者主表记录删除，从表关联记录的外键设置为 null
- RESTRICT：只有没有从表的关联记录时，才允许删除主表记录或者更新主表记录的主键 id
- NO ACTION： 同 RESTRICT，只是 sql 标准里分了 4 种，但 mysql 里 NO ACTION 等同于 RESTRICT。



```sql
ALTER TABLE `hello-mysql`.`id_card`
DROP FOREIGN KEY `user_id`;
ALTER TABLE `hello-mysql`.`id_card`
ADD CONSTRAINT `user_id`
 FOREIGN KEY(`user_id`)
 REFERENCES `hello-mysql`.`user`(`id`)
 ON DELETE RESTRICT
 ON UPDATE RESTRICT
 
 #删除主表中的 id = 2的数据 , 会报错, 因为从表中有关联主表的数据
 DELETE FROM `hello-mysql`.`user` WHERE (`id`='2');
 #将从表中的关联id=2 设置为null
 UPDATE `hello-mysql`.`id_card` SET user_id=null WHERE user_id=2;
 
 #再次删除 提示成功~
```



 **RESTIRCT 和 NO ACTION 的处理逻辑：只要从表有关联记录，就不能更新 id 或者删除记录。**



 **CASCADE 的处理逻辑：主表删除，从表关联记录也级联删除，主表 id 更新，从表关联记录也跟着更新。**



**set null 的处理逻辑：主表记录删除或者修改 id，从表关联记录外键置为 null。**



查询的时候需要使用 join on，默认是 inner join 也就是只返回有关联的记录，也可以用 left join、right join 来额外返回没有关联记录的左表或右表的记录。

from 后的是左表，join 后的是右表。

此外，外键还可以设置级联方式，也就是主表修改 id 或者删除的时候，从表怎么做。

有 3 种级联方式：CASCADE（关联删除或更新），SET NULL（关联外键设置为 null），RESTRICT 或者 NO ACTION（没有从表的关联记录才可以删除或更新）



3个表关联查询 ,  id 为 1 的 article 的所有标签：

```sql
SELECT * FROM article as a JOIN article_tag as at ON a.id=at.article_id JOIN tag as t ON t.id = at.tag_id WHERE a.id = 1;

#指定返回的列：
SELECT t.name AS 标签名, a.title AS 文章标题
    FROM article a 
    JOIN article_tag at ON a.id = at.article_id
    JOIN tag t ON t.id = at.tag_id
    WHERE a.id = 1;

#删除文章1 内容
DELETE FROM article WHERE id = 1;

#再次执行上述的查询操作, 联级也会被删除~
```

![join on](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723145947320.png)

![next](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723150001994.png)





我们创建了部门、员工表，并在员工表添加了引用部门 id 的外键 department_id 来保存这种一堆多关系。

并且设置了级联方式为 set null。

创建了文章表、标签表、文章标签表来保存多堆多关系，多对多不需要在双方保存彼此的外键，只要在中间表里维护这种关系即可。

中间表的外键级联方式一定为 CASCADE，因为数据没了关系就没必要还留着了。

此外，多对多的 join 需要连接 3 个表来查询。

一对多、多对多是非常常见的表之间的关系，要好好掌握它们的外键设置、关联查询、级联方式。



### 子查询

查询学生表中成绩最高的学生的姓名和班级名称。

```sql
SELECT name,class FROM student WHERE score = (SELECT MAX(score) FROM student);
```

![姓名和班级名称](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723201212158.png)



查询成绩高于全校平均成绩的学生记录：

```sql
SELECT * FROM student2 WHERE score > (SELECT AVG(score) FROM student2);
```

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723201443883.png)



子查询还有个特有的语法 EXISTS、NOT EXISTS。

#### EXISTS 

对每个 department，在子查询里查询它所有的 employee。

如果存在员工，那么条件成立，就返回这个部门的 name。

这就是 EXISTS 的作用：子查询返回结果，条件成立，反之不成立。

```sql
SELECT name FROM department
    WHERE EXISTS (
        SELECT * FROM employee WHERE department.id = employee.department_id
    );
```

![EXISTS](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723202225312.png)



#### NOT EXISTS 



```sql
SELECT name FROM department
    WHERE NOT EXISTS (
            SELECT * FROM employee WHERE department.id = employee.department_id
    );
```

![ NOT EXISTS](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723202443915.png)



查询加个最高的产品信息:

```sql
SELECT name,price FROM product WHERE price = (SELECT MAX(price) FROM product);
```

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723204424685.png)

把每个产品分类的分类名、平均价格查出来放入另一个 avg_price_by_category 表。



```sql
INSERT INTO avg_price_by_category (category, avg_price)   SELECT category, AVG(price) FROM product GROUP BY category;
```

![insert 子查询](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723210022724.png)



update子查询

```sql
#技术部所有人的 name 前加上 “技术-"
UPDATE employee SET name = CONCAT('技术-', name) 
    WHERE department_id = (
        SELECT id FROM department WHERE name = '技术部'
    );
```

delete 子查询

```sql
#删除技术部所有的员工
DELETE FROM employee WHERE department_id = (
    SELECT id FROM department WHERE name = '技术部'
);

```

sql 和 sql 可以组合来完成更复杂的功能，这种语法叫做子查询。

它还有个特有的关键字 EXISTS（和 NOT EXISTS），当子查询有返回结果的时候成立，没有返回结果的时候不成立。

子查询不止 select 可用，在 update、insert、delete 里也可以用。

灵活运用子查询，能写出功能更强大的 sql。



### SQL 进阶

#### 需求 1: 查询每个客户的订单总金额

客户的订单存在订单表里，可能有多个，这里需要 JOIN ON 关联两个表，然后用 GROUP BY 根据客户 id 分组，再通过 SUM 函数计算价格总和。

```sql
SELECT customers.name, SUM(orders.total_amount) AS total_amount 
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id
GROUP BY customers.id
ORDER BY total_amount DESC #降序
LIMIT 0,3; #从弟0个开始取3个
```

![需求1](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723215434175.png)



![降序,取前三条](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723215652649.png)



#### 需求 2: 查询每个客户的订单总金额，并计算其占比

每个客户的总金额的需求上面实现了，这里需要算占比，就需要通过一个子查询来计算全部订单的总金额，然后相除：

```sql
SELECT customers.name,SUM(orders.total_amount) AS total_amount,
SUM(orders.total_amount) / (SELECT SUM(total_amount) FROM orders) AS percentage 
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id
GROUP BY customers.id;
```

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723223034862.png)



#### 需求 3：查询每个客户的订单总金额，并列出每个订单的商品清单



这里在总金额的基础上，多了订单项的查询，需要多关联一个表：

```sql
SELECT customers.name,orders.order_date,orders.total_amount,order_items.product_name,order_items.quantity, order_items.price
FROM customers
JOIN orders ON customers.id = orders.customer_id
JOIN order_items ON orders.id = order_items.order_id
ORDER BY customers.name, orders.order_date;
```

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723223429052.png)

#### 需求 4：查询每个客户的订单总金额，并列出每个订单的商品清单，同时只显示客户名字姓“张”的客户的记录：

总金额和商品清单的需求前面实现了，这里只需要加一个 WHERE 来过滤客户名就行：

```sql
SELECT customers.name, orders.order_date, orders.total_amount, 
	order_items.product_name, order_items.quantity, order_items.price
    FROM customers
    INNER JOIN orders ON customers.id = orders.customer_id
    INNER JOIN order_items ON orders.id = order_items.order_id
    WHERE customers.name LIKE '张%'
    ORDER BY customers.name, orders.order_date;
```

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723223531961.png)



#### 需求 5:查询每个客户的订单总金额，并列出每个订单的商品清单，同时只显示订单日期在2022年1月1日到2022年1月3日之间的记录

这里比上面的需求只是多了日期的过滤，范围是一个区间，用 BETWEEN AND：

```sql
SELECT customers.name, orders.order_date,
	orders.total_amount, order_items.product_name,
    order_items.quantity, order_items.price
    FROM customers
    INNER JOIN orders ON customers.id = orders.customer_id
    INNER JOIN order_items ON orders.id = order_items.order_id
    WHERE orders.order_date BETWEEN '2022-01-01' AND '2022-01-03'
    ORDER BY customers.name, orders.order_date;
```

因为这里的 order_date 是 date 类型，所以指定范围也只是用 2022-01-01 这种格式的。如果是 datetime，那就要用 2022-01-01 10:10:00 这种格式了。



#### 需求 6：查询每个客户的订单总金额，并计算商品数量，只包含商品名称包含“鞋”的商品，商品名用-连接，显示前 3 条记录：

查询订单总金额和商品数量都需要用 group by 根据 customer.id 分组，过滤出只包含鞋的商品。



把分组的多条商品名连接起来需要用 GROUP_CONCAT 函数。



然后 LIMIT 3



```sql
SELECT 
        c.name AS customer_name,
        SUM(o.total_amount) AS total_amount,
        COUNT(oi.id) AS total_quantity,
        GROUP_CONCAT(oi.product_name SEPARATOR '-') AS product_names
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    JOIN order_items oi ON o.id = oi.order_id
    WHERE oi.product_name LIKE '%鞋%'
    GROUP BY c.name
    ORDER BY total_amount DESC
    LIMIT 3;
```

GROUP_CONCAT 函数是用于 group by 分组后，把多个值连接成一个字符串的。

LIMIT 3 就相当于 LIMIT 0,3 也就是从 0 开始 3 条记录

#### 需求 7: 查询存在订单的客户

使用子查询 + EXISTS 来实现：

```sql
 SELECT * FROM customers c WHERE EXISTS (
		SELECT 1 FROM orders o WHERE o.customer_id = c.id
    );
```

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230723224425951.png)

也可以用 NO EXISTS 来查询没有下单过的客户：



```sql
SELECT * FROM customers c
    WHERE NOT EXISTS (
            SELECT 1 FROM orders o WHERE o.customer_id = c.id
    );
```



#### 需求 8: 将王磊的订单总金额打九折



更新它们为 90%：



```sql
  UPDATE orders o SET o.total_amount = o.total_amount * 0.9
    WHERE o.customer_id IN (
		SELECT id FROM customers WHERE name = "王磊"
    );
```



这里订单不止一条，所以用 IN 来指定一个集合。



customers 和 orders、orders 和 order_items 都是一对多的关系。



### 事务

开启事务：



```sql
START TRANSACTION;
```



执行两条 sql 语句：

```sql
UPDATE order_items SET quantity=1 WHERE order_id=3;

UPDATE orders SET total_amount=200 WHERE id=3;
```

发现改错了，想再改回去

```sql
ROLLBACK;
```



数据恢复~~~



确实想提交，那可以执行 COMMIT：

```sql
START TRANSACTION;

UPDATE order_items SET quantity=1 WHERE order_id=3;

UPDATE orders SET total_amount=200 WHERE id=3;

COMMIT;
```

据就真正被修改，不能回滚了。



果我不是想回滚所有的 sql 语句，只是回滚一部分 , 手动告诉 mysql 一些保存的点：



```sql
START TRANSACTION;

SAVEPOINT aaa;

UPDATE order_items SET quantity=1 WHERE order_id=3;

SAVEPOINT bbb;

UPDATE orders SET total_amount=200 WHERE id=3;

SAVEPOINT ccc;

#回滚到 bbb 的位置：在此查询 只有 order_items修改了

ROLLBACK TO SAVEPOINT bbb;
#回滚到 ccc： 都修改了
ROLLBACK TO SAVEPOINT ccc;



```

**START TRANSACTION 开启事务后所有的 sql 语句都可以 ROLLBACK，除非执行了 COMMIT 完成这段事务。**

**还可以设置几个 SAVEPOINT，这样可以 ROLLBACK TO 任何一个 SAVEPOINT 的位置。**



果事务还没有 COMMIT，但是它修改了一些表，这时候我们能查到它修改后的数据么？

这就涉及到事务的隔离级别的概念了。



MYSQL 有 4 种事务隔离级别：

- **READ UNCOMMITTED**：可以读到别的事务尚未提交的数据。

  这个事务内第一次读的数据是 aaa，下次读可能就是 bbb 了，这个问题叫做**不可重复读**。

  而且，万一你读到的数据人家又回滚了，那你读到的就是临时数据，这个问题叫做**脏读**。

- **READ COMMITTED**：只读取别的事务已提交的数据。

​	   但是还是有可能你这个事务内第一次读的数据是 aaa，下次读可能是 bbb ，也就是不可重复读   	   的	问题依然存在。

​	   不只是数据不一样，可能你两次读取到的记录行数也不一样，这叫做**幻读**。

- **REPEATABLE READ**：在同一事务内，多次读取数据将保证结果相同。

​		这个级别保证了读取到的数据一样，但是不保证行数一样，也就是说解决了不可重复读的问    		题，但仍然存在幻读的问题。

- **SERIALIZABLE**：在同一时间只允许一个事务修改数据。



事务一个个执行，各种问题都没有了。

但是负面影响就是性能很差，只能一个个的事务执行。

这 4 种级别主要是数据一致性和性能的差别，一致性越好，并发性能就越差。



可以这样查询当前的事务隔离级别：



```sql
select @@transaction_isolation;
```



事务内的几条 sql 要么全部成功，要么全部不成功，这样能保证数据的一致性。

它的使用方式是 START TRANSACTION; COMMIT; 或者 ROLLBACK;

还可以设置 SAVEPOINT，然后 ROLLBACK TO SAVEPOINT;

事务还没提交的数据，别的事务能不能读取到，这就涉及到隔离级别的概念了。

一般就用默认的隔离级别就行，也就是 REPEATABLE READ。

基本上，只要写增删改的 sql，那都是要开事务的。



#### 视图

视图一般只用来做查询，因为它增删改的限制比较多，比如只有单表的视图可以增删改，并且要求不在视图里的字段都有默认值等。

```sql
CREATE VIEW customer_orders AS SELECT c.name AS customer_name, o.id AS order_id,o.order_date,o.total_amount FROM customers c JOIN orders o ON c.id = o.customer_id;
```



#### 存储过程

```sql
DELIMITER $$
CREATE PROCEDURE get_customer_orders(IN customer_id INT)
BEGIN
        SELECT o.id AS order_id, o.order_date, o.total_amount
        FROM orders o
		WHERE o.customer_id = customer_id;
END $$
DELIMITER ;
```



首先 DELIMITER $$ 定义分隔符为 $$ 因为默认是分号 ;  , 这样中间就可以写 ; 了，不会中止存储过程的 sql。 最后再恢复为之前的分隔符：DELIMITER ;



```sql
CALL get_customer_orders(5);
```

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230724205452029.png)

用的时候传入参数 CALL 一下就行。



一个求平方的函数：

```sql
SET GLOBAL log_bin_trust_function_creators = 1;

DELIMITER $$ 
CREATE FUNCTION square(x INT)
RETURNS INT
BEGIN
    DECLARE result INT;
    SET result = x * x;
    RETURN result;
END $$
DELIMITER ;
```

CREATE FUNCTION 声明函数的名字和参数 x，并且通过 RETURNS 声明返回值类型。

BEGIN、END 中间的是函数体。

先 DECLARE 一个 INT 类型的变量，然后 SET 它的值为 x * x，之后通过 RETURN 返回这个结果。



 创建一个函数 get_order_total，参数为 INT 类型的 order_id，返回值为 DECIMAL(10, 2) 类型。 Next:

```sql

DELIMITER $$
CREATE FUNCTION get_order_total(order_id INT)
RETURNS DECIMAL(10,2)
BEGIN
	DECLARE total DECIMAL(10,2);
	SELECT SUM(quantity * price) INTO total
		FROM order_items
		WHERE order_id = order_items.order_id;
	RETURN total;
END $$
DELIMITER ;
```



了解即可
