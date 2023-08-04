import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DcModule } from './dc/dc.module';
import { Dc } from './dc/entities/dc.entity';
import { createClient } from 'redis';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: '192.168.1.7',
      host: 'mysql-container',

      port: 3306,
      username: 'root',
      password: 'thunderchen',
      database: 'docker_compose',
      synchronize: true,
      logging: true,
      entities: [Dc],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    DcModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            // host: '192.168.1.7',
            host: 'redis-container',
            port: 6379,
          },
        });

        await client.connect();
        return client;
      },
    },
  ],
})
export class AppModule {}
