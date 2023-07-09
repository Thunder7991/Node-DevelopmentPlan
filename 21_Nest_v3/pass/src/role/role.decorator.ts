import { SetMetadata } from '@nestjs/common';
import { Role } from './role';

export const Roles = (...args: Role[]) => SetMetadata('role', args);
