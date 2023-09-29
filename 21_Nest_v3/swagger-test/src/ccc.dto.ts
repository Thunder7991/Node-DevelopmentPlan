import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CccDto {
  @ApiProperty({
    name: 'aaa',
    enum: ['aaa', 'bbb', 'ccc'],
    maxLength: 30,
    minLength: 3,
    required: true,
  })
  aaa: string;

  @ApiPropertyOptional({
    name: 'bbb',
    maximum:60,
    minimum: 1,
    default:30,
    example:55
  })
  bbb: number;

  @ApiProperty({
    name: 'ccc',
  })
  ccc: Array<string>;
}
