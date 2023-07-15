import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

//自定义Pipe
@Injectable()
export class CustomPipePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);
    //打印的 value 就是 query、param 的值，而 metadata 里包含 type、metatype、data
    //type 就是 @Query、@Param、@Body 装饰器，或者自定义装饰器：
    //而 metatype 是参数的 ts 类型：
    //data 是传给 @Query、@Param、@Body 等装饰器的参数。
    console.log(metadata);
    return value;
  }
}
