import { PartialType } from '@nestjs/swagger';
import { CreateMysqlDto } from './create-mysql.dto';

export class UpdateMysqlDto extends PartialType(CreateMysqlDto) {}
