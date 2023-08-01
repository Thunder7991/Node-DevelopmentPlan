import { SetMetadata } from '@nestjs/common';

export const RequireLogin = () => SetMetadata('require-login', true);
