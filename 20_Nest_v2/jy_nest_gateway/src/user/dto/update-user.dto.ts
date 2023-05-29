import { PartialType } from '@nestjs/mapped-types';
import { AddUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(AddUserDto) {}
