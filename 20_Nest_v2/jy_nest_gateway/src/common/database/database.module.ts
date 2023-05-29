import { Module } from '@nestjs/common';
import { DatabaseProviders } from './database.providers';
// 已经封装了 MongoDB 的 Provider，如果需要引入 MySQL 或者其他类型数据库的话，只需要替换对应的配置参数
@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {}
