import { PartialType } from '@nestjs/mapped-types';
import { CreateDynamicModuleDto } from './create-dynamic-module.dto';

export class UpdateDynamicModuleDto extends PartialType(
  CreateDynamicModuleDto,
) {}
