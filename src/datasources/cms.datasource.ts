import '../boilerplate.polyfill';

import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { DataSourceNameEnum } from '../constants/datasoure-name';
import { SnakeNamingStrategy } from '../snake-naming.strategy';

dotenv.config();
export const cmsDataSource = new DataSource({
  name: DataSourceNameEnum.CMS,
  type: process.env.CMS_DB_TYPE as any,
  host: process.env.CMS_DB_HOST,
  port: Number(process.env.CMS_DB_PORT),
  username: process.env.CMS_DB_USERNAME,
  password: process.env.CMS_DB_PASSWORD,
  database: process.env.CMS_DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/modules/cms/tai-khoan/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/cms/*{.ts,.js}'],
});
