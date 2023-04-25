import { PartialType } from '@nestjs/mapped-types';
import { CreateSpiderDto } from './create-spider.dto';

export class UpdateSpiderDto extends PartialType(CreateSpiderDto) {}
