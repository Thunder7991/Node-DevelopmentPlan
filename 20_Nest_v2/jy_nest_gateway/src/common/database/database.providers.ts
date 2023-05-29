import { getConfig } from '@/utils';
import { DataSourceOptions } from 'typeorm';

// 设置数据库类型
const databaseType: DataSourceOptions['type'] = 'mongodb';
const { MONGODB_CONFIG } = getConfig();
