### 掌握Nest Cli

nest 在 @nestjs/cli 包里提供了 nest 命令，它可以用来做很多事情：

* 生成项目结构和各种代码
* 编译代码
* 监听文件变动自动编译
* 打印项目依赖信息
* 也就是这些子命令：

* nest new 快速创建项目
* nest generate 快速生成各种代码
* nest build 使用 tsc 或者 webpack 构建代码
* nest start 启动开发服务，支持 watch 和调试
* nest info 打印 node、npm、nest 包的依赖版本

### 5种HTTP数据传输方式

* url param

  * `http://guang.zxg/person/1111  `

* query

  * query 是 url 中 ? 后的字符串，需要做 url encode。

* form urlencoded

  * 通过body传递数据，设置`content-type:application/x-www-form-urlencoded`

* json

  * 通过指定`content-type:application/json`

* form data

  * `content-type:mulitipart/form-data`

  

  其中前两种是 url 中的：

  - **url param**： url 中的参数，Nest 中使用 @Param 来取
  - **query**：url 中 ? 后的字符串，Nest 中使用 @Query 来取

  后三种是 body 中的：

  - **form urlencoded**： 类似 query 字符串，只不过是放在 body 中。Nest 中使用 @Body 来取，axios 中需要指定 content type 为 `application/x-www-form-urlencoded`，并且对数据用 qs 或者 query-string 库做 url encode
  - **json**： json 格式的数据。Nest 中使用 @Body 来取，axios 中不需要单独指定 content type，axios 内部会处理。
  - **form data**：通过 ----- 作为 boundary 分隔的数据。主要用于传输文件，Nest 中要使用 FilesInterceptor 来处理其中的 binary 字段，用 @UseInterceptors 来启用，其余字段用 @Body 来取。axios 中需要指定 content type 为 `multipart/form-data`，并且用 FormData 对象来封装传输的内容。



### IOC控制反转

后端系统有很多的对象，这些对象之间的关系错综复杂，如果手动创建并组装对象比较麻烦，所以后端框架一般都提供了 IoC 机制。

IoC 机制是在 class 上标识哪些是可以被注入的，它的依赖是什么，然后从入口开始扫描这些对象和依赖，自动创建和组装对象。

Nest 里通过 @Controller 声明可以被注入的 controller，通过 @Injectable 声明可以被注入也可以注入别的对象的 provider，然后在 @Module 声明的模块里引入。

并且 Nest 还提供了 Module 和 Module 之间的 import，可以引入别的模块的 provider 来注入。

虽然 Nest 这套实现了 IoC 的模块机制看起来繁琐，但是却解决了后端系统的对象依赖关系错综复杂的痛点问题。



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



### 使用多种Provider

一般情况下，provider 是通过 @Injectable 声明，然后在 @Module 的 providers 数组里注册的 class。

默认的 token 就是 class，这样不用使用 @Inject 来指定注入的 token。

但也可以用字符串类型的 token，不过注入的时候要用 @Inject 单独指定。

除了可以用 useClass 指定注入的 class，还可以用 useValue 直接指定注入的对象。

如果想动态生成对象，可以使用 useFactory，它的参数也注入 IOC 容器中的对象，然后动态返回 provider 的对象。

如果想起别名，可以用 useExisting 给已有的 token，指定一个新 token。

灵活运用这些 provider 类型，就可以利用 Nest 的 IOC 容器中注入任何对象。



### 全局模块和生命周期

模块可以通过 @Global 声明为全局的，这样它 exports 的 provider 就可以在各处使用了，不需要 imports。

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b84285b51b5441ef9759438bc302fbf3~tplv-k3u1fbpfcp-jj-mark:2079:0:0:0:q75.awebp)

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7882084092c4259943880eb14c9405d~tplv-k3u1fbpfcp-jj-mark:2079:0:0:0:q75.awebp)

可以在其中做一些初始化、销毁的逻辑，比如 onApplicationShutwon 里通过 moduleRef.get 取出一些 provider，执行关闭连接等销毁逻辑。

```javascript
 onApplicationShutdown() {
    const cccService = this.moduleRef.get<CccService>(CccService);
    console.log('--------------------------', cccService.findAll());

    console.log('CccModule onApplicationShutdown');
  }
```



### AOP框架



MVC 是 Model View Controller 的简写。MVC 架构下，请求会先发送给 Controller，由它调度 Model 层的 Service 来完成业务逻辑，然后返回对应的 View。

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



### TypeOrm

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230725000946662.png)

DataSource 里管理着数据库连接配置，数据库驱动包，调用它的 intialize 方法会创建和 mysql 的连接。

连接创建的时候，如果指定了 synchronize，会根据 Entitiy 生成建表 sql。

Entity 里通过 @Entity 指定和数据库表的映射，通过 @PrimaryGeneratedColumn 和 @Column 指定和表的字段的映射。

对 Entity 做增删改查通过 EntityManager 的 save、delete、find、createQueryBuilder 等方法。

如果只是对单个 Entity 做 CRUD，那可以先 getRepository 拿到对具体 Entity 操作的工具类，再调用 save、delete、find 等方法。

具体的 EntityManager 和 Repository 的方法有这些：

- save：新增或者修改 Entity，如果传入了 id 会先 select 再决定修改还新增
- update：直接修改 Entity，不会先 select
- insert：直接插入 Entity
- delete：删除 Entity，通过 id
- remove：删除 Entity，通过对象
- find：查找多条记录，可以指定 where、order by 等条件
- findBy：查找多条记录，第二个参数直接指定 where 条件，更简便一点
- findAndCount：查找多条记录，并返回总数量
- findByAndCount：根据条件查找多条记录，并返回总数量
- findOne：查找单条记录，可以指定 where、order by 等条件
- findOneBy：查找单条记录，第二个参数直接指定 where 条件，更简便一点
- findOneOrFail：查找失败会抛 EntityNotFoundError 的异常
- query：直接执行 sql 语句
- createQueryBuilder：创建复杂 sql 语句，比如 join 多个 Entity 的查询
- transaction：包裹一层事务的 sql
- getRepository：拿到对单个 Entity 操作的类，方法同 EntityManager



#### Typeorm 一对一



TypeORM 里一对一关系的映射通过 @OneToOne 装饰器来声明，维持外键列的 Entity 添加 @JoinColumn 装饰器。

如果是非外键列的 Entity，想要关联查询另一个 Entity，则需要通过第二个参数指定外键列是另一个 Entity 的哪个属性。

可以通过 @OneToOne 装饰器的 onDelete、onUpdate 参数设置级联删除和更新的方式，比如 CASCADE、SET NULL 等。

还可以设置 cascade，也就是 save 的时候会自动级联相关 Entity 的 save。

增删改分别通过 save 和 delete 方法，查询可以通过 find 也可以通过 queryBuilder，不过要 find 的时候要指定 relations 才会关联查询。



#### Typeorm 一对多

TypeORM 会自动在多的那一方添加外键，不需要通过 @JoinColumn 指定，不过你可以通过 @JoinColumn 来修改外键列的名字。

双方只能有一方 cascade，不然会无限循环。设置了 cascade 之后，只要一方保存，关联的另一方就会自动保存。

删除的话，如果设置了外键的 CASCADE 或者 SET NULL，那只删除主表（一的那一方）对应的 Entity 就好了，msyql 会做后续的关联删除或者 id 置空。

否则就要先删除所有的从表（多的那一方）对应的 Entity 再删除主表对应的 Entity。



#### Typeorm多对多



但如果双方都保留了对方的引用，需要第二个参数来指定关联的外键列在哪，也就是如何查找当前 entity。

多对多关系的修改只要查出来之后修改下属性，然后 save，TypeORM 会自动去更新中间表。

至此，一对一、一对多、多对多关系的 Entity 如何映射到数据库的 table，如何增删改查



### Nest继承Typeorm

在 Nest 里集成只是对 TyprOrm 的 api 封装了一层。

使用方式是在根模块 TypeOrmModule.forRoot 传入数据源配置。

然后就可以在各处注入 DataSource、EntityManager 来做增删改查了。

如果想用 Repository 来简化操作，还可以在用到的模块引入 TypeOrmModule.forFeature 的动态模块，传入 Entity，会返回对应的 Repository。

这样就可以在模块内注入该 Repository 来用了。

它的原理是 TypeOrmModule.forRoot 对应的动态模块是全局的，导出了 dataSource、entityManager，所以才可以到处注入。

而 TypeOrmModule.forFeature 则会根据吧传入 Entity 对应的 Repository 导出，这样就可以在模块内注入了。

这就是 Nest 里集成 TypeOrm 的方式和实现原理。



### Redis



Docker中进入交互模式输入命令`redis-cli` :

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230727222533924.png)

#### String

略

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa3391bda1ff4967abecbd2a0da7e8c5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



incr 是用于递增的, 平时我们用的阅读量、点赞量等都是通过这个来计数的。 



```shell
set mykey "thunderchen"

get mykey 

keys '*'

keys "thunder*"

keys "dong*"
```



#### List 

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230727225805596.png)

```shell
# lpush 是 left push 的意思，执行后会从左到右添加到列表中。
lpush list1 111
lpush list1 222
lpush list1 333

# rpush 是 right push 的意思，执行后会从右往左添加到列表中：
rpush list1 444
rpush list1 555

# lpop是从左边删除数据。
lpop list1

# lpop是从右边删除数据。
rpop list1

# 查看list数据

# 查看全部数据
lrange list1 0 -1

#查询list长度
llen list1

# LMOVE 交换元素 语法 LMOVE source destination LEFT|RIGHT LEFT|RIGHT timeout
LMOVE list1 list2 RIGHT LEFT

#LTRIM 是一个用于修剪列表（List）的命令。它用于保留列表中指定范围内的元素，而删除其他元素，从而缩减列表的长度。语法: LTRIM key start stop
# 保留索引 1 - 3
LTRIM mylist 1 3 
```

#### Set

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230727232413106.png)



set 的特点是无序并且元素不重复。

添加去重之后的数据：

```shell
# 实际填入为111 , 222 , 333
sadd set1 111
sadd set1 111
sadd set1 111
sadd set1 222
sadd set1 222
sadd set1 333

#sismember 判断是否是集合中的元素：
sismember set1 111

#SREM 集合中删除摸个元素
SREM set1 111

#SINTER 获取多个集合的交集的命令。它将返回所有给定集合的成员交集，也就是同时存在于所有集合中的成员。
SINTER set1 set2

#SCARD 获取成员中的数量
SCARD set1

#SMEMBERS 查看成员中的元素
SMEMBERS set1

```

![sismember](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230727232731340.png)

set 只能去重、判断包含，不能对元素排序。



![SREM](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230728221304307.png)

![SINTER](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230728224932212.png)



#### ZSET有序集合

ZSET 的特点和用途如下：

1. 排序：ZSET 中的成员按照其关联的分数进行排序，可以根据分数从小到大或从大到小的顺序对成员进行排序。
2. 独特性：ZSET 中的成员是唯一的，不允许重复。
3. 快速查找：通过成员名字可以快速查找到其关联的分数，也可以根据分数范围快速查找成员。
4. 精确计算：ZSET 中的分数可以是浮点数，因此可以进行精确计算。

ZSET 在实际应用中有很多用途，例如：

- 排行榜：可以使用 ZSET 来实现游戏的排行榜，根据玩家得分进行排序。
- 时间序列：可以将时间作为分数，将事件或数据按照时间顺序存储在 ZSET 中，方便进行时间范围内的查询。
- 带权重的数据：可以将权重作为分数，根据权重对数据进行排序。



```shell
#ZADD 每个元素是有一个分数的：
zadd zset1 5 guang
zadd zset1 4 dong
zadd zset1 3 xxx
zadd zset1 6 yyyy
#ZRANGE命令取数据, 获取排名前三的数据 (0 - 2)
ZRANGE zset1 0 2
#ZRANK 命令用于获取有序集合（ZSET）中指定成员的排名（即索引），按照成员的分数从小到大排序
ZRANK zset1 "xxx"

#ZREVRANK 用于获取有序集合（ZSET）中指定成员的逆序排名（即逆序索引），按照成员的分数从大到小排序。逆序排名是从0开始计算的

ZREVRANK zset1 "xxx"

```



![ZADD](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230728233215381.png)

![ZRANGE](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230728233334468.png)



#### HASH



```shell
#HSET 
hset hash1 key1 1
hset hash1 key2 2
hset hash1 key3 3
hset hash1 key4 4
hset hash1 key5 5

#HGET
hget hash1 key3

#HMGET   获取哈希表（Hash）中一个或多个字段的值。它返回一个数组，数组中包含指定字段的值。
HMGET hash1 key1 key2

#HINCRBY  原来的数值中加99 (1 => 100)
HINCRBY hash1 key1 99

#HSCAN 用于迭代哈希键中的键值对
HSCAN site 0  match "t*" count 10
#虽然增量式迭代命令不保证每次迭代所返回的元素数量， 但我们可以使用 COUNT 选项， 对命令的行为进行一定程度上的调整。 基本上， COUNT 选项的作用就是让用户告知迭代命令， 在每次迭代中应该从数据集里返回多少元素






```

![HMGET](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230729000819169.png)

![HINCRBY](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230729001247723.png)

#### GEO

geo 的数据结构，就是经纬度信息，根据距离计算周围的人用的。zset 存储的，把经纬度转化为了二维平面的坐标

```shell
#GEO
GEOADD loc 13.361389 38.115556 "member"
geoadd loc 13.361389 38.115556 "thunder" 15.087269 37.502669 "chen" 

#GEODIST 计算两个坐标点的距离
geodist loc thunder chen

#georadius    搜索某个半径内的其他点，传入经纬度、半径和单位
georadius loc  15 37 100 km
```

![GEO](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230729002106173.png)

![GEODIST](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230729002322175.png)

![georadius](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230729002534138.png)

#### 设置过期时间

redis 的 key 我们会设置过期时间，通过 expire 命令。

比如我设置 dong1 的 key 为 30 秒过期：

```shell
set dong1 1
#expire 30秒后会消失
expire dong1 30

#查看剩余时间
ttl dong1

```

#### 总结

因为 mysql 存在硬盘，并且会执行 sql 的解析，会成为系统的性能瓶颈，所以我们要做一些优化。

常见的就是在内存中缓存数据，使用 redis 这种内存数据库。

它是 key、value 的格式存储的，value 有很多种类型，比如 string、list、set、sorted set(zset)、hash、geo 等。

灵活运用这些数据结构，可以完成各种需求，比如排行榜用 zset、阅读数点赞数用 string、附近的人用 geo 等。

而且这些 key 都可以设置过期时间，可以完成一些时效性相关的业务。

用官方 GUI 工具 RedisInsight 可以可视化的操作它，很方便。

redis 几乎和 mysql 一样是后端系统的必用中间件了，它除了用来做数据库的缓存外，还可以直接作为数据存储的地方。



### JWT 和 Session



**session + cookie 的给 http 添加状态的方案是服务端保存 session 数据，然后把 id 放入 cookie 返回，cookie 是自动携带的，每个请求可以通过 cookie 里的 id 查找到对应的 session，从而实现请求的标识。这种方案能实现需求，但是有 CSRF、分布式 session、跨域等问题，不过都是有解决方案的。**





**JWT 的方案是把状态数据保存在 header 里，每次请求需要手动携带，没有 session + cookie 方案的 CSRF、分布式、跨域的问题，但是也有安全性、性能、没法控制等问题。**



**session + cookie**：把状态数据保存到服务端，session id 放到 cookie 里返回，这样每次请求会带上 cookie ，通过 id 来查找到对应的 session。这种方案有 CSRF、分布式 session、跨域的问题。

**jwt**：把状态保存在 json 格式的 token 里，放到 header 中，需要手动带上，没有 cookie + session 的那些问题，但是也有安全性、性能、没法手动控制失效的问题。



常用的方案基本是 session + redis、jwt + redis 这种。



**携带 jwt 需要加载 authorization 的 header 里，以 Bearer xxx 的格式，但是返回 jwt 可以放在任何地方，header、cookie 或者 body 里都可以。**



session 使用的是 express 的 express-session 中间件，通过 @Session 装饰器取出来传入 controller 里。

jwt 需要引入 @nestjs/jwt 包的 JwtModule，注入其中的 JwtService，然后通过 jwtService.sign 生成 token，通过 jwtService.verify 验证 token。

token 放在 authorization 的 header 里。



### MySQL + TypeORM + JWT 实现登录注册

typeorm 通过 @PrimaryGeneratedKey、@Column、@CreateDateColumn、@UpdateDateColumn 声明和数据库表的映射。

通过 TypeOrmModule.forRoot、TypeOrmModule.forFeature 的动态模块添加数据源，拿到 User 的 Repository。

然后用 Repository 来做增删改查，实现注册和登录的功能。

登录之后，把用户信息通过 jwt 的方式放在 authorization 的 header 里返回。

然后 LoginGuard 里面取出 header 来做验证，token 正确的话才放行。

此外，参数的校验使用 ValidationPipe + class-validator 来实现。

这样，就实现了注册和基于 JWT 的登录功能。



### ALC



有的接口除了需要登录外，还需要权限。

只有登录用户有调用该接口的权限才能正常访问。



 ACL （Access Control List）的方式实现了权限控制，它的特点是用户直接和权限关联。

用户和权限是多对多关系，在数据库中会存在用户表、权限表、用户权限中间表。

登录的时候，把用户信息查出来，放到 session 或者 jwt 返回。

然后访问接口的时候，在 Guard 里判断是否登录，是否有权限，没有就返回 401，有的话才会继续处理请求。

我们采用的是访问接口的时候查询权限的方案，通过 handler 上用 SetMetadata 声明的所需权限的信息，和从数据库中查出来的当前用户的权限做对比，有相应权限才会放行。

但是这种方案查询数据库太频繁，需要用 redis 来做缓存。

当然，你选择登录的时候把权限一并查出来放到 session 或者 jwt 里也是可以的。

这就是通过 ACL 实现的权限控制。



### RBAC0

 RBAC（role based access control） 权限控制，它相比于 ACL （access control list）的方式，多了一层角色，给用户分配角色而不是直接分配权限。

当然，检查权限的时候还是要把角色的权限合并之后再检查是否有需要的权限的。

我们通过 jwt 实现了登录，把用户和角色信息放到 token 里返回。

添加了 LoginGuard 来做登录状态的检查。

然后添加了 PermissionGuard 来做权限的检查。

LoginGuard 里从 jwt 取出 user 信息放入 request，PermissionGuard 从数据库取出角色对应的权限，检查目标 handler 和 controller 上声明的所需权限是否满足。

LoginGuard 和 PermissionGuard 需要注入一些 provider，所以通过在 AppModule 里声明 APP_GUARD 为 token 的 provider 来注册的全局 Gard。

然后在 controller 和 handler 上添加 metadata 来声明是否需要登录，需要什么权限，之后在 Guard 里取出来做检查。

这种方案查询数据库也比较频繁，也应该加一层 redis 来做缓存。

这就是基于 RBAC 的权限控制，是用的最多的一种权限控制方案。

当然，这是 RBAC0 的方案，更复杂一点的权限模型，可能会用 RBAC1、RBAC2 等，那个就是多角色继承、用户组、角色之间互斥之类的概念



### RefreshToken

access_token 用于身份认证，refresh_token 用于刷新 token，也就是续签。

在登录接口里同时返回 access_token 和 refresh_token，access_token 设置较短的过期时间，比如 30 分钟，refresh_token 设置较长的过期时间，比如 7 天。

当 access_token 失效的时候，可以用 refresh_token 去刷新，服务端会根据其中的 userId 查询用户数据，返回新 token。

在前端代码里，可以在登录之后，把 token 放在 localstorage 里。

然后用 axios 的 interceptors.request 给请求时自动带上 authorization 的 header。

用 intercetpors.response 在响应是 401 的时候，自动访问 refreshToken 接口拿到新 token，然后再次访问失败的接口。



### Docker Compose



#### Mysql

```shell
docker run -d -p 3306:3306 -v E:\DockerTempVolumes:/var/lib/mysql --name mysql-container mysql
```



#### Docker

```shell
docker run -d -p 6379:6379 -v E:\DockerTempVolumes\redis:/data --name redis-container redis
```

#### Nest

```shell
docker run -d -p 3000:3000 --name nest-container eee
```



#### 查看日志

```shell
docker logs mysql-container
docker logs redis-container
docker logs nest-container
```



#### docker-compose.yml

```shell
services:
  nest-app:
    build:
      context: ./
      dockerfile: ./Dockerfile
    depends_on:
      - mysql-container
      - redis-container
    ports:
      - '3000:3000'
  mysql-container:
    image: mysql
    ports:
      - '3306:3306'
    volumes:
      - /Users/guang/mysql-data:/var/lib/mysql
  redis-container:
    image: redis
    ports:
      - '6379:6379'
    volumes:
      - /Users/guang/aaa:/data

```



运行

```shell
docker-compose up
```

停止

```shell
docker-compose down

docker-compose -f /path/to/docker-compose.yml down

docker-compose stop service_name
```

删除

```shell
docker rm mysql-container redis-container nest-container

#用于停止并删除由 docker-compose 启动的所有容器，并且同时删除关联的镜像。
docker-compose down --rmi all
```



docker 的方式需要手动 docker build 来构建 nest 应用的镜像。

然后按顺序使用 docker run 来跑 mysql、redis、nest 容器。

（要注意 nest 容器里需要使用宿主机 ip 来访问 mysql、redis 服务）

而 docker compose 就只需要写一个 docker-compose.yml 文件，配置多个 service 的启动方式和 depends_on 依赖顺序。

然后 docker-compose up 就可以批量按顺序启动一批容器。

基本上，我们跑 Nest 项目都会依赖别的服务，所以在单台机器跑的时候都是需要用 Docker Compose 的。



### Docker 桥接网络



创建 network

```shell
docker network create common-network
```



执行 --network

```shell
docker run -d --network common-network -v E:\DockerTempVolumes:/var/lib/mysql --name mysql-container mysql

docker run -d --network common-network -v E:\DockerTempVolumes\redis:/data --name redis-container redis

```



重新打包nest

```shell
docker build -t mmm .

docker run -d --network common-network -p 3000:3000 --name nest-container mmm
```



docker-compose:

```dockerfile
services:
  nest-app:
    build:
      context: ./
      dockerfile: ./Dockerfile
    depends_on:
      - mysql-container
      - redis-container
    ports:
      - "3000:3000"
    networks:
      - common-network
  mysql-container:
    image: mysql
    volumes:
      - E:\DockerTempVolumes:/var/lib/mysql
    environment:
      MYSQL_ALLOW_EMPTY_PASSWORD: "false"
      MYSQL_USER: "root"
      MYSQL_PASSWORD: "thunderchen"
    networks:
      - common-network

  redis-container:
    image: redis
    volumes:
      - E:\DockerTempVolumes\redis:/data
    networks:
      - common-network

networks:
 common-network:
   driver: bridge

```



启动:

```dockerfile
docker-compose up
```





把 mysql、redis 的端口映射到宿主机，然后 nest 的容器里通过宿主机 ip 访问这两个服务的。

但其实有更方便的方式，就是桥接网络。

通过 docker network create 创建一个桥接网络，然后 docker run 的时候指定 --network，这样 3 个容器就可以通过容器名互相访问了。

在 docker-compose.yml 配置下 networks 创建桥接网络，然后添加到不同的 service 上即可。

或者不配置 networkds，docker-compose 会生成一个默认的。

实现原理就是对 Network Namespace 的处理，本来是 3个独立的 Namespace，当指定了 network 桥接网络，就可以在 Namespace 下访问别的 Namespace 了。

多个容器之间的通信方式，用桥接网络是最简便的。



### Docker重启策略



```shell
# 命令
docker run --name=restart-test-container restart-test:first

#重启策略 --restart 

docker run -d --restart=always --name=restart-test-container2 restart-test:first

#pm2重启策略
FROM node:18-alpine3.14

WORKDIR /app

COPY ./index.js .

RUN npm install -g pm2

CMD [ "pm2-runtime","/app/index.js" ]

#最多重启3次
docker run -d --restart=on-failure:3 --name=restart-test-container4 restart-test:first

# unless-stopped 是除非手动停止，否则总是会重启。

docker run -d --restart=unless-stopped --name=restart-test-container5 restart-test:first

# 除非手动停止
docker stop restart-test-container5

#always 和 unless-stopped 区别
#always 重启策略的容器又跑起来了，而 unless-stopped 的容器没有重启



```



Docker 是支持自动重启的，可以在 docker run 的时候通过 --restart 指定重启策略，或者 Docker Compose 配置文件里配置 restart。

有 4 种重启策略：

- no: 容器退出不自动重启（默认值）
- always：容器退出总是自动重启，除非 docker stop。
- on-failure：容器非正常退出才自动重启，还可以指定重启次数，如 on-failure:5
- unless-stopped：容器退出总是自动重启，除非 docker stop

重启策略为 always 的容器在 Docker Deamon 重启的时候容器也会重启，而 unless-stopped 的不会。

其实我们用 PM2 也是主要用它进程崩溃的时候重启的功能，而在有了 Docker 之后，用它的必要性就不大了。

当然，进程重启的速度肯定是比容器重启的速度快一些的，如果只是 Docker 部署，可以结合 pm2-runtime 来做进程的重启。

绝大多数情况下，直接用 Docker 跑 node 脚本就行，不需要 PM2。





### Nginx



```shell
docker cp  nginx1:/usr/share/nginx/html E:\DockerTempVolumes\nginx

docker cp  E:\DockerTempVolumes\nginx nginx1:/usr/share/nginx/html-xxx

docker cp E:\DockerTempVolumes\nginx nginx1:/usr/share/nginx/html-xxx
```



#### 基础语法



```shell
location = /111/ {
	default_type text/plainl
	return 200 "111 success"
}
location /222 {
	default_type text/plain;
	return 200 $uri
}
location ~* ^/444/AAA.*\.html$ {
	default_type text/plain;
	return 200 $uri;  # Nginx 内置变量，代表请求的 URI。
}
```

**root 和 alias 的区别就是拼接路径时是否包含匹配条件的路径。**



```shell
location /222 {
    alias /dddd;
}

location /222 {
    root /dddd;
}


```

/222/xxx/yyy.html

如果是 alias 配置，它会把去掉 /222 之后的部分路径拼接在后面。

也就是会查找 /dddd/xxx/yyy.html 文件。

如果是用 root 的配置，会把整个 uri 作为路径拼接在后面。

也就是会查找 /dddd/222/xxx/yyy.html 文件。



标识:

^~ : 表示最高优先级



#### 反向代理

```shell
 location ^~ /api {
	proxy_set_header name thunderchen;
	 proxy_pass http://192.168.1.7:3000;
  }
```

上面Demo , 在本地启动端口号为3000的nest服务



作用之一就是可以透明的修改请求 和 响应



第二 , 可以实现负载均衡

```shell
#修改default.conf(顶层修改)
upstream nest-server {
	server 192.168.1.7:3001;
	server 192.168.1.7:3002;
}

#修改配置
location ^~ /api {
	proxy_set_header name thunderchen;
	#proxy_pass http://192.168.1.7:3000;
	proxy_pass http://nest-server; #与上方命名相同
  }

```



一共有 4 种负载均衡策略：

- 轮询：默认方式。
- weight：在轮询基础上增加权重，也就是轮询到的几率不同。
- ip_hash：按照 ip 的 hash 分配，保证每个访客的请求固定访问一个服务器，解决 session 问题。
- fair：按照响应时间来分配，这个需要安装 nginx-upstream-fair 插件。

测试下 weight 和 ip_hash : weight=2，默认是 1，这样两个服务器轮询到的几率是 2 比 1。



weight:

```shell
upstream nest-server {
	server 192.168.1.7:3001;
	server 192.168.1.7:3002 weight=2;
}
```

![weight](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230805101553041.png)

ip_hash :

```shell
upstream nest-server {
	ip_hash;
	server 192.168.1.7:3001;
	server 192.168.1.7:3002;
}
```

![ip_hash](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230805101637927.png)





 docker 跑了 nginx 服务器，并使用了它的静态资源托管功能，还有动态资源的反向代理功能。

nginx 的配置文件在 /etc/nginx/nginx.conf 里，它默认还引入了 /etc/nginx/conf.d 下的子配置文件。

默认 html 都放在 /usr/share/nginx/html 下。

我们可以通过 docker cp 来把容器内文件复制到宿主机来修改。

修改 nginx 配置，在 server 里配置路由，根据不同的 url 返回不同的静态文件。

有 4 种 location 语法：

- location /aaa 根据前缀匹配
- location ^~ /aaa 根据前缀匹配，优先级更高
- location = /aaa 精准匹配
- location ~ /aaa/.*html 正则匹配
- location ~* /aaa/.*html 正则匹配，而且不区分大小写

优先级是 精确匹配（=） > 高优先级前缀匹配（^~） > 正则匹配（～ ~*） > 普通前缀匹配

除了静态资源托管外，nginx 还可以对动态资源做反向代理。

也就是请求发给 nginx，由它转发给应用服务器，这一层也可以叫做网关。

nginx 反向代理可以修改请求、响应信息，比如设置 header。

当有多台应用服务器的时候，可以通过 upstream 配置负载均衡，有 4 种策略：轮询、带权重的轮询、ip_hash、fair。



> Nginx在线配置 [Nginx io ](https://www.digitalocean.com/community/tools/nginx?global.app.lang=zhCN)





### nginx实现灰度系统



什么是灰度系统 ?  I really don't know



我问了问GPT:  旨在将新版本的软件逐渐引入生产环境,以降低风险并确保稳定性,在灰度系统中, 会有一部分用户或流量会被导流到新版本 , 而其他用户仍然使用旧版本. 这种部署方式可以用于网站 应用程序和服务的更新,以验证新版本在生产环境中的性能和稳定性。

它还举了例子: 例如随机选择一小部分用户、按地理位置分配或根据用户的特定属性。灰度部署通常需要使用负载均衡、反向代理、配置管理等技术来实现。

身为小白,  对于将新功能逐渐引入到生产环境甚是疑惑



nginx 有反向代理的功能，可以转发请求到应用服务器，也叫做网关层。

我们可以在这一层根据 cookie 里的 version 字段来决定转发请求到哪个服务。

在这之前，还需要按照比例来给流量染色，也就是返回不同的 cookie。

不管灰度系统做的有多复杂，底层也就是流量染色、根据标记转发流量这两部分，我们完全可以自己实现一个。





### 分布式session

![session](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230827213104991.png)



![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230827213128265.png)

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20230827213157465.png)





### swagger 

需要先安装 @nestjs/swagger 的包。

然后在 main.ts 里用 DocumentBuilder + SwaggerModule.createDocuemnt 创建 swagger 文档配置，然后 setup 跑起来就好了。

还需要手动加一些装饰器来标注：

- ApiOperation：声明接口信息
- ApiResponse：声明响应信息，一个接口可以多种响应
- ApiQuery：声明 query 参数信息
- ApiParam：声明 param 参数信息
- ApiBody：声明 body 参数信息，可以省略
- ApiProperty：声明 dto、vo 的属性信息
- ApiPropertyOptional：声明 dto、vo 的属性信息，相当于 required: false 的 ApiProperty
- ApiTags：对接口进行分组
- ApiBearerAuth：通过 jwt 的方式认证，也就是 Authorization: Bearer xxx
- ApiCookieAuth：通过 cookie 的方式认证
- ApiBasicAuth：通过用户名、密码认证，在 header 添加 Authorization: Basic xxx

swagger 是 openapi 标准的实现，可以在 url 后加个 -json 拿到对应的 json，然后导入别的接口文档平台来用。

绝大多数公司的接口文档都是用 swagger 来自动生成的，不然手动维护太麻烦了。

而且 swagger 还可以方便的测试接口，自动添加身份认证等。



### Fighting Redis Again

- **string**： 可以存数字、字符串，比如存验证码就是这种类型
- **hash**：存一个 map 的结构，比如文章的点赞数、收藏数、阅读量，就可以用 hash 存
- **set**：存去重后的集合数据，支持交集、并集等计算，常用来实现关注关系，比如可以用交集取出互相关注的用户
- **zset**：排序的集合，可以指定一个分数，按照分数排序。我们每天看的文章热榜、微博热榜等各种排行榜，都是 zset 做的
- **list**：存列表数据
- **geo**：存地理位置，支持地理位置之间的距离计算、按照半径搜索附近的位置

![geo](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20231002120352730.png)



添加信息

```shell
geoadd loc 14.1361 38,1155 "thunderchen" 15.22 37.22 "clearlove"
```

loc: key值

thunderchen的经纬度是 14.1361 38,1155

clearlove的经纬度是 15.22 37.22 



计算两点之间的距离

```shell
geodist loc thunderchen clearlove
```



查找经度15 纬度37 位置的附近100KM半径和200KM半径的点:

```shell
georadius loc 15 37 100 km
georadius loc 15 37 200 km
```



使用基于位置的功能，比如附近的充电宝、酒店，打车，附近的人等功能。

这些都是基于 redis 实现的，因为 redis 有 geo 的数据结构，可以方便的计算两点的距离，计算某个半径内的点。

前端部分使用地图的 sdk 分别在搜出的点处绘制 marker 就好了。

geo 的底层数据结构是 zset，所以可以使用 zset 的命令。

我们在 Nest 里封装了 geoadd、geopos、zrange、georadius 等 redis 命令。实现了添加点，搜索附近的点的功能。



### 邮件

比如写邮件不能直接贴 html + css，不能写 markdown，收邮件不能按照规则自动下载附件、自动保存邮件内容。

这些需求我们都能通过代码来自己实现。

发邮件是基于 SMTP 协议，收邮件是基于 POP3 或 IMAP 协议。

node 分别有 nodemailer 包和 imap 包用来支持收发邮件的协议。

我们通过 nodemailer 发送了 html 的邮件，可以发送任何 html+css 的内容。

通过 imap 实现了邮件的搜索，然后用 mailparser来做了内容解析，然后把邮件内容和附件做了下载。

能够写代码来收发邮件之后，就可以做很多自动化的事情了：

比如定时自动发一些邮件，内容是从数据库查出来的，比如自动拉取邮件，根据一定的规则来保存邮件和附件内容等。



#### 邮箱验证

主要是注意全局配置env文件方法

```js
// 安装
npm install --save @nestjs/config
//app.moudle导入
imports:[
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: 'src/.env'
})
]

//编写env
...

//注入到Service
import { ConfigService } from '@nestjs/config';
constructor(private configService: ConfigService) {
      this.transporter = createTransport({
          host: "smtp.qq.com",
          port: 587,
          secure: false,
          auth: {
              user: this.configService.get('email_user'),
              pass: this.configService.get('email_password')
          },
      });
    }

//修改nest-cli.json文件 如果你用到了 .env 文件或者 yaml 等文件来配置，需要在 nest-cli.json 里配置下 assets 和 watchAssets。
  "compilerOptions": {
    "deleteOutDir": true,
    "watchAssets": true,
    "assets": ["*.env"]
  }
//注意.env需要复制到src目录下才可以打包到dist文件夹中


```

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20231003221154539.png)

用户填入邮箱地址，点击发送验证码，后端会生成验证码，发送邮件。并且还要把这个验证码存入 redis，以用户邮箱地址为 key。

之后用户输入验证码，点击登录。

后端根据邮箱地址去 redis 中查询下验证码，和用户传过来的验证码比对下，如果一致，就从 mysql 数据库中查询该用户的信息，放入 jwt 中返回。



综合用到了 mysql、redis、typeorm、nodemailer 等技术。

并且使用 @nestjs/config 包的 ConfigModule 来封装配置。

要注意的是，如果用了 .env 文件，需要保证它在 src 下，并且要在 nest-cli.json 里配置 assets 和 watchAssets，不然 build 的时候不会复制到 dist 下。



### 定时任务/redis阅读数量统计



redis + 定时任务实现了阅读量计数的功能。

因为阅读是个高频操作，所以我们查出数据后存在 redis里，之后一直访问 redis 的数据，然后通过定时任务在凌晨 4 点把最新数据写入数据库。

并且为了统计真实的用户阅读量，我们在 redis 存储了用户看了哪篇文章的标识，10 分钟后过期。



### 三种定时任务

主要有 cron、timeout、interval 这 3 种任务。

其中 cron 是依赖 cron 包实现的，而后两种则是对原生 api 的封装。

我们学习了 cron 表达式，还是挺复杂的，当然，你也可以直接用 CronExpression 的一些常量。

此外，你还可以注入 SchedulerRegistery 来对定时任务做增删改查。

定时任务里可以注入 service，来定时执行一些逻辑，在特定业务场景下是很有用的



### SSE

服务端实时推送数据，除了用 WebSocket 外，还可以用 HTTP 的 Server Sent Event。

只要 http 返回 Content-Type 为 text/event-stream 的 header，就可以通过 stream 的方式多次返回消息了。

它传输的是 json 格式的内容，可以用来传输文本或者二进制内容。

我们通过 Nest 实现了 sse 的接口，用 @Sse 装饰器标识方法，然后返回 Observe 对象就可以了。内部可以通过 observer.next 随时返回数据。

前端使用 EventSource 的 onmessage 来接收消息。

这个 api 的兼容性很好，除了 ie 外可以放心的用。

它的应用场景有很多，比如站内信、构建日志实时展示、chatgpt 的消息返回等。



### 二维码登录

扫码登录流程

![](C:\Users\85352\AppData\Roaming\Typora\typora-user-images\image-20231104223317606.png)

pc 端生成二维码，然后不断轮询二维码状态。

APP 里扫码拿到 qrcode_id，然后分别调用 scan、confirm、cancel 来修改二维码状态。

并且登录之后会把 token 带过去。

在 redis 里保存着二维码的状态和用户信息，然后这边确认之后，另一边就可以用 userInfo 生成 jwt 的 token，从而实现登录。

这就是扫码登录的实现原理。



### REPL

略

### 自定义 Exception Filter

通过 @Catch 指定要捕获的异常，然后在 catch 方法里拿到异常信息，返回对应的响应。

如果捕获的是 HttpException，要注意兼容下 ValidationPipe 的错误格式的处理。

filter 可以通过 @UseFilters 加在 handler 或者 controller 上，也可以在 main.ts 用 app.useGlobalFilters 全局启用。

如果 filter 要注入其他 provider，就要通过 AppModule 里注册一个 token 为 APP_FILTER 的 provider 的方式。

此外，捕获的 Exception 也是可以自定义的。

这样，我们就可以自定义异常和异常返回的响应格式了。



​	
