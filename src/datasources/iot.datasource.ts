import '../boilerplate.polyfill';

import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { SnakeNamingStrategy } from '../snake-naming.strategy';

dotenv.config();
export const iotDataSource = new DataSource({
  name: 'iot',
  type: process.env.IOT_DB_TYPE as any,
  host: process.env.IOT_DB_HOST,
  port: Number(process.env.IOT_DB_PORT),
  username: process.env.IOT_DB_USERNAME,
  password: process.env.IOT_DB_PASSWORD,
  database: process.env.IOT_DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['../src/modules/iot/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/iot/*{.ts,.js}'],
});
