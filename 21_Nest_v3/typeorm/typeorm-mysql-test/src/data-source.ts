import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'thunderchen',
  database: 'practice',
  synchronize: true,
  logging: true, //日志
  entities: [User],
  migrations: [],
  subscribers: [],
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
  },
});
