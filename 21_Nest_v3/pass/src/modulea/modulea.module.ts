import { Module, forwardRef } from '@nestjs/common';
import { ModulebModule } from 'src/moduleb/moduleb.module';

@Module({
  imports: [forwardRef(() => ModulebModule)],
})
export class ModuleaModule {}
