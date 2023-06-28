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
