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
