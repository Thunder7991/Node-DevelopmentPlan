import { PartialType } from '@nestjs/mapped-types';
import { CreatePDto } from './create-p.dto';

export class UpdatePDto extends PartialType(CreatePDto) {}
