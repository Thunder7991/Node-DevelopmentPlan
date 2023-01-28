import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '邮箱' })
  readonly email: string;
  @ApiProperty({ description: '密码', default: '123456' })
  password: string;
}
