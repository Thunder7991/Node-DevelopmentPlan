import { Module } from '@nestjs/common';
import { PService } from './p.service';
import { PController } from './p.controller';

@Module({
  controllers: [PController],
  providers: [PService]
})
export class PModule {}
