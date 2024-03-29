import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Headers,
  HttpException,
  Inject,
  Logger,
  MaxFileSizeValidator,
  Next,
  ParseFilePipe,
  Post,
  Response,
  SetMetadata,
  UploadedFile,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GuardGuard } from './guard/guard.guard';
import {
  Decorator,
  Fff,
  Ggg,
  Hhh,
  Iii,
  MyHeaders,
  MyQuery,
} from './decorator/decorator.decorator';
import { FilterFilter } from './filter/filter.filter';
import { AaaException } from './filter/AaaException';
import { FilterguardGuard } from './filterguard/filterguard.guard';
import { Roles } from './role/role.decorator';
import { Role } from './role/role';
import { MdGuardGuard } from './md-guard/md-guard.guard';
import { MdInterInterceptor } from './md-inter/md-inter.interceptor';
import { TextRxInterceptor } from './text-rx/text-rx.interceptor';
import { TestRxmapInterceptor } from './test-rxmap/test-rxmap.interceptor';
import { TestRxtapInterceptor } from './test-rxtap/test-rxtap.interceptor';
import { TestRxcatcherrorInterceptor } from './test-rxcatcherror/test-rxcatcherror.interceptor';
import { TextRxtimeoutInterceptor } from './text-rxtimeout/text-rxtimeout.interceptor';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { storage } from './storage/uploadStorage';
import { FileSizeValidationPipePipe } from './file-size-validation-pipe/file-size-validation-pipe.pipe';
import { MyFileValidator } from './customFileValidator/customFileValidator';

// @Controller()
// @Hhh()
@Iii('thunder', 'chen')
//可以放到Class上
@SetMetadata('rolesArr', ['admin'])
export class AppController {
  private logger = new Logger();
  constructor(
    @Inject('app_service') private readonly appService: AppService,
    // private readonly appService: AppService,
    @Inject('person') private readonly person: { name: string; age: number },
    @Inject('person2')
    private readonly person2: { name: string; desc: string },
    @Inject('person5')
    private readonly persion5: { name: string; desc: string },
  ) {}

  //自定义装饰器
  @Get()
  @SetMetadata('decorator', 'admin')
  @UseGuards(GuardGuard)
  getHello(): string {
    // debugger;
    console.log(this.person);
    console.log(this.person2);
    console.log(this.persion5);

    return this.appService.getHello();
  }

  @Get('hello')
  @Decorator('decorator')
  @UseGuards(GuardGuard)
  //局部使用interceptor
  @UseInterceptors(
    TextRxInterceptor,
    // TestRxmapInterceptor,
    TestRxtapInterceptor,
    TestRxcatcherrorInterceptor,
    TextRxtimeoutInterceptor,
  )
  // @UseInterceptors(TestRxmapInterceptor)
  async getHello2() {
    // throw new Error('xxxx');
    await new Promise<void>((resolve) => setTimeout(resolve, 4000));
    return this.appService.getHello();
  }

  @Fff('hello2', 'thunderchen')
  getHello3(@Ggg() c): string {
    console.log(73, c);
    return this.appService.getHello();
  }

  @Fff('hello3', 'thunderchen')
  getHello4(@Ggg() c): string {
    return c;
  }
  @Fff('hello5', 'thunderchen')
  getHello5(@Headers('Accept') Header, @MyHeaders('Accept') headers) {
    console.log(Header);
  }
  @Fff('hello6', 'thunderchen')
  getHello6(@Headers('Accept') Header, @MyQuery('chen') query) {
    console.log('query', query);
  }

  //路由级别使用Aaafilter
  @Get('filter')
  @UseFilters(FilterFilter)
  @UseGuards(FilterguardGuard)
  @Roles(Role.Admin)
  getHello7(): string {
    throw new AaaException('aaa', 'bbb');
    return this.appService.getHello();
  }

  //metaData 元数据
  @Get('metadata')
  @UseGuards(MdGuardGuard)
  @UseInterceptors(MdInterInterceptor)
  @SetMetadata('rolesArr', ['admin'])
  getHello8(): string {
    return this.appService.getHello();
  }

  @Get('midd1')
  getMidd1(): string {
    console.log('midd1');
    return this.appService.getHello();
  }
  @Get('midd2')
  getMidd2(): string {
    console.log('midd2');
    return this.appService.getHello();
  }

  @Get('ware1')
  getMidd3(): string {
    console.log('ware1');
    return this.appService.getHello();
  }

  // @Get('aaa')
  // nest(@Next() next, @Response({ passthrough: false }) response) {
  //   console.log(next, response);
  //   return 'hello';
  // }
  @Get('aaa')
  nest(@Next() next) {
    next();
    return 'hello'; //hello2
  }
  @Get('aaa')
  b2() {
    return 'hello2';
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('upload', {
      dest: 'uploads', // 运行脚本的时候自动创建uploads目录
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log('body', body);
    console.log('file', file);
  }

  @Post('uploads')
  @UseInterceptors(
    FilesInterceptor('uploads', 2, {
      dest: 'uploads', // 运行脚本的时候自动创建uploads目录
    }),
  )
  uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    console.log('body', body);
    console.log('files', files);
  }

  @Post('uploadnext')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'aaa', maxCount: 2 },
        { name: 'bbb', maxCount: 3 },
      ],
      {
        dest: 'uploads',
      },
    ),
  )
  uploadFileFields(
    @UploadedFiles()
    files: { aaa?: Express.Multer.File[]; bbb?: Express.Multer.File[] },
    @Body() body,
  ) {
    console.log('body', body);
    console.log('files', files);
  }

  @Post('anyupload')
  @UseInterceptors(
    AnyFilesInterceptor({
      // dest: 'uploads',
      storage: storage,
    }),
  )
  uploadAnyFiles(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    console.log('body', body);
    console.log('files', files);
  }

  @Post('validationUpload')
  @UseInterceptors(
    FileInterceptor('aaa', {
      dest: 'uploads',
      // storage: storage,
    }),
  )
  uploadFileValidation(
    @UploadedFiles(FileSizeValidationPipePipe)
    files: Express.Multer.File,
    @Body() body,
  ) {
    console.log('body', body);
    console.log('files', files);
  }

  @Post('parseFileUpload')
  @UseInterceptors(
    FileInterceptor('aaa', {
      dest: 'uploads',
    }),
  )
  uploadFile3(
    @UploadedFile(
      new ParseFilePipe({
        exceptionFactory(error) {
          throw new HttpException('xxx' + error, 404);
        },
        validators: [
          new MyFileValidator({}),
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body,
  ) {
    console.log('body', body);
    console.log('file', file);
  }

  @Get('logger')
  getLoggerHello(): string {
    this.logger.debug('aaa', AppController.name);
    this.logger.error('bbb', AppController.name);
    this.logger.log('ccc', AppController.name);
    this.logger.verbose('ddd', AppController.name);
    this.logger.warn('eee', AppController.name);
    return this.appService.getHello();
  }
}
