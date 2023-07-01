import { Module, OnApplicationShutdown } from '@nestjs/common';
import { CccService } from './ccc.service';
import { CccController } from './ccc.controller';
import { ModuleRef } from '@nestjs/core';

@Module({
  controllers: [CccController],
  providers: [CccService],
})
export class CccModule implements OnApplicationShutdown {
  constructor(private moduleRef: ModuleRef) {}
  onApplicationShutdown(signal?: string) {
    const cccService = this.moduleRef.get<CccService>(CccService);
    console.log('----------------', cccService.findAll());

    console.log('CccModule onApplicationShutdown' + signal);
  }
}
