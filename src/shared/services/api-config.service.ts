import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ThrottlerOptions } from '@nestjs/throttler';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import type { Units } from 'parse-duration';
import { default as parse } from 'parse-duration';

import { UserSubscriber } from '../../entity-subscribers/user-subscriber';
import { SnakeNamingStrategy } from '../../snake-naming.strategy';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getDuration(key: string, format?: Units): number {
    const value = this.getString(key);
    const duration = parse(value, format);

    if (duration === undefined) {
      throw new Error(`${key} environment variable is not a valid duration`);
    }

    return duration;
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replaceAll('\\n', '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }

  get throttlerConfigs(): ThrottlerOptions {
    return {
      ttl: this.getDuration('THROTTLER_TTL', 'second'),
      limit: this.getNumber('THROTTLER_LIMIT'),
      // storage: new ThrottlerStorageRedisService(new Redis(this.redis)),
    };
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const entities = [
      __dirname + '/../../modules/user/*.entity{.ts,.js}',
      __dirname + '/../../modules/user/*.view-entity{.ts,.js}',
      __dirname + '/../../modules/post/*.entity{.ts,.js}',
      __dirname + '/../../modules/post/*.view-entity{.ts,.js}',
      __dirname + '/../../modules/device-telemetry/**/*.entity{.ts,.js}',
      __dirname + '/../../modules/iot/**/*.entity{.ts,.js}',
    ];
    const migrations = [
      __dirname + '/../../database/migrations/main/*{.ts,.js}',
    ];

    return {
      entities,
      migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: this.getString('DB_TYPE') as any,
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      subscribers: [UserSubscriber],
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get cmsMariaDbConfig(): TypeOrmModuleOptions {
    const entities = [
      __dirname + '/../../modules/tai-khoan/*.entity{.ts,.js}',
      __dirname + '/../../modules/tai-khoan/*.view-entity{.ts,.js}',
    ];
    // const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];
    Logger.log(entities);

    return {
      entities,
      //   migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: this.getString('CMS_DB_TYPE') as any,
      name: 'cms',
      host: this.getString('CMS_DB_HOST'),
      port: this.getNumber('CMS_DB_PORT'),
      username: this.getString('CMS_DB_USERNAME'),
      password: this.getString('CMS_DB_PASSWORD'),
      database: this.getString('CMS_DB_DATABASE'),
      subscribers: [],
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get iotPosgresConfig(): TypeOrmModuleOptions {
    const entities = [__dirname + '/../../modules/__/*.entity{.ts,.js}'];
    // const migrations = [
    //   __dirname + '/../../database/migrations/iot/*{.ts,.js}',
    // ];
    Logger.log(entities);

    return {
      entities,
      //   migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: this.getString('IOT_DB_TYPE') as any,
      name: 'iot',
      host: this.getString('IOT_DB_HOST'),
      port: this.getNumber('IOT_DB_PORT'),
      username: this.getString('IOT_DB_USERNAME'),
      password: this.getString('IOT_DB_PASSWORD'),
      database: this.getString('IOT_DB_DATABASE'),
      subscribers: [],
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get natsConfig() {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  get mqttConfig() {
    return {
      port: this.getNumber('MQTT_PORT'),
      host: this.getString('MQTT_HOST'),
      username: this.getString('MQTT_USERNAME'),
      password: this.getString('MQTT_PASSWORD'),
    };
  }

  get mqttEnabled(): boolean {
    return this.getBoolean('MQTT_ENABLED');
  }
}
