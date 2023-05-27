import { PartialType } from '@nestjs/mapped-types';
import { CreateMangerDto } from './create-manger.dto';

export class UpdateMangerDto extends PartialType(CreateMangerDto) {}
