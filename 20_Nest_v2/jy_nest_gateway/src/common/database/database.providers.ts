import { getConfig } from '@/utils';
const path = require('path');
import { DataSource, DataSourceOptions } from 'typeorm';

// 设置数据库类型
const databaseType: DataSourceOptions['type'] = 'mongodb';
//获取mongodb配置信息
const { MONGODB_CONFIG } = getConfig();

const MONGODB_DATABASE_CONFIG = {
  ...MONGODB_CONFIG,
  type: databaseType,
  //   只要是以 entity.ts 结尾的实例类，都会被自动扫描识别，并在数据库中生成对应的实体表。
  entities: [
    path.join(
      __dirname,
      `../../**/*.${MONGODB_CONFIG.entities}.entity{.ts,.js}`,
    ),
  ],
};
//创建数据库实例
// DataSource 用于定义数据库连接的配置和参数，它是创建 Connection 的重要方式之一。
const MONGODB_DATA_SOURCE = new DataSource(MONGODB_DATABASE_CONFIG);

//数据库注入
export const DatabaseProviders = [
  {
    provide: 'MONGODB_DATA_SOURCE',
    useFactory: async () => {
      await MONGODB_DATA_SOURCE.initialize();
      return MONGODB_DATA_SOURCE;
    },
  },
];
