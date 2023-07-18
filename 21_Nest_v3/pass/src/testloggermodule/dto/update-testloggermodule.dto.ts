import { PartialType } from '@nestjs/mapped-types';
import { CreateTestloggermoduleDto } from './create-testloggermodule.dto';

export class UpdateTestloggermoduleDto extends PartialType(CreateTestloggermoduleDto) {}
