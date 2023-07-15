import { PartialType } from '@nestjs/mapped-types';
import { CreateTestPipeDto } from './create-test-pipe.dto';

export class UpdateTestPipeDto extends PartialType(CreateTestPipeDto) {}
