import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // JwtModule.register({
    //   secret: 'thunderchen',
    //   signOptions: { expiresIn: '7d' }, // 60 segundos
    // }),
    //异步导入
    JwtModule.registerAsync({
      async useFactory() {
        return {
          secret: 'thunderchen',
          signOptions: { expiresIn: '7d' }, // 60 segundos
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
