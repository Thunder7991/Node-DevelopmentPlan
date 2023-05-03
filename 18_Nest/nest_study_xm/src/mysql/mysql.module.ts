import { Module } from '@nestjs/common';
import { MysqlService } from './mysql.service';
import { MysqlController } from './mysql.controller';
import { Mysql } from './entities/mysql.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Mysql])],
  controllers: [MysqlController],
  providers: [MysqlService],
})
export class MysqlModule {}
