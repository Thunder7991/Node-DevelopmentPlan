import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  Optional,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

//自定义Pipe
@Injectable()
export class CustomPipePipe implements PipeTransform {
  // @Optional() //因为标记了 @Optional，没找到对应的 provider 也不会报错：
  // @Inject('validation_options')
  private options;
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype) {
      return value;
    }
    console.log(22, this.options);
    //打印的 value 就是 query、param 的值，而 metadata 里包含 type、metatype、data
    //type 就是 @Query、@Param、@Body 装饰器，或者自定义装饰器：
    //而 metatype 是参数的 ts 类型：
    //data 是传给 @Query、@Param、@Body 等装饰器的参数。
    console.log(metadata);

    //class-transformer and class-validator
    //metatype 就是拿到dto文件中的校验
    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('参数验证失败！');
    }
    return value;
  }
}
