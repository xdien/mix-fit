import '../boilerplate.polyfill';

import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { UserSubscriber } from '../entity-subscribers/user-subscriber';
import { SnakeNamingStrategy } from '../snake-naming.strategy';

dotenv.config();
export const dataSource = new DataSource({
  name: 'default',
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: [UserSubscriber],
  entities: [
    'src/modules/{auth,user,post}/*.entity{.ts,.js}',
    'src/modules/device-telemetry/**/*.entity{.ts,.js}',
    'src/modules/iot/**/*.entity{.ts,.js}',
  ],
  migrations: ['src/database/migrations/*{.ts,.js}'],
});
