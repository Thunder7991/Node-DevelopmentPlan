import { ApiProperty } from '@nestjs/swagger';

export class CreateGuardDto {
  @ApiProperty({ example: '小满' })
  name: string;
  @ApiProperty({ example: 19 })
  age: number;
}
