import { PartialType } from '@nestjs/mapped-types';
import { CreateDcDto } from './create-dc.dto';

export class UpdateDcDto extends PartialType(CreateDcDto) {}
