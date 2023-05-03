import { PartialType } from '@nestjs/mapped-types';
import { CreateGuardDto } from './create-guard.dto';

export class UpdateGuardDto extends PartialType(CreateGuardDto) {}
