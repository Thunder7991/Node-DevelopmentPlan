import { Module, forwardRef } from '@nestjs/common';
import { ModuleaModule } from 'src/modulea/modulea.module';

@Module({
  imports: [forwardRef(() => ModuleaModule)],
})
export class ModulebModule {}
