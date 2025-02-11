import './boilerplate.polyfill';

import { BullModule } from '@nestjs/bullmq';
import type { DynamicModule } from '@nestjs/common';
import { Logger, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';

import { ModuleLoader } from './common/module.loader';
import { PRIVATE_MODULES } from './config/private-modules.config';
import { DataSourceNameEnum } from './constants/datasoure-name';
import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { IotModule } from './modules/iot/iot.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { MqttModule } from './mqtt/mqtt.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { TranslationModule } from './translation/translation.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [SharedModule, TranslationModule],
})
export class AppModule {
  static async register(): Promise<DynamicModule> {
    const baseImports = [
      ClsModule.forRoot({
        global: true,
        middleware: { mount: true },
      }),
      ThrottlerModule.forRootAsync({
        useFactory: (configService: ApiConfigService) => ({
          throttlers: [configService.throttlerConfigs],
        }),
        inject: [ApiConfigService],
      }),
      TypeOrmModule.forRootAsync({
        useFactory: (configService: ApiConfigService) => ({
          ...configService.postgresConfig,
        }),
        dataSourceFactory: async (options) => {
          if (!options) {
            throw new Error('DataSource options are undefined');
          }

          const dataSource = await new DataSource(options).initialize();
          addTransactionalDataSource(dataSource);

          return dataSource;
        },
        inject: [ApiConfigService],
      }),
      TypeOrmModule.forRootAsync({
        name: DataSourceNameEnum.CMS,
        useFactory: (configService: ApiConfigService) => ({
          ...configService.cmsMariaDbConfig,
          name: DataSourceNameEnum.CMS,
        }),
        dataSourceFactory: async (options) => {
          if (!options) {
            throw new Error('DataSource options are undefined');
          }

          const existingDataSource = getDataSourceByName(
            DataSourceNameEnum.CMS,
          );

          if (existingDataSource) {
            return existingDataSource;
          }

          return await new DataSource(options).initialize();
        },
        inject: [ApiConfigService],
      }),
      BullModule.forRootAsync({
        useFactory: () => {
          const logger = new Logger('BullModule');

          return {
            connection: {
              host: process.env.REDIS_HOST ?? 'localhost',
              port: Number(process.env.REDIS_PORT) || 6379,
              password: process.env.REDIS_PASSWORD,
            },
            onError: (error: unknown) => {
              logger.error('Redis connection error:', error);
            },
            beforeClientCreated: () => {
              logger.debug('Connecting to Redis...', {
                host: process.env.REDIS_HOST ?? 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
                hasPassword: Boolean(process.env.REDIS_PASSWORD),
              });
            },
            afterClientCreated: (client: any) => {
              logger.debug('Redis connected successfully');
              client
                .ping()
                .then(() => {
                  logger.debug('Redis ping successful');
                })
                .catch((error: Error) => {
                  logger.error('Redis ping failed:', error);
                });
            },
          };
        },
      }),
    ];

    const featureModules = [
      AuthModule,
      UserModule,
      PostModule,
      WebsocketModule,
      HealthCheckerModule,
      MqttModule,
      IotModule,
    ];

    // Load private modules
    const privateModules = await Promise.all(
      PRIVATE_MODULES.map(async (moduleInfo) => {
        const moduleConfig = {
          enable: process.env[moduleInfo.configKey] === 'true',
          config: {},
        };

        return ModuleLoader.loadPrivateModule(moduleInfo.path, moduleConfig);
      }),
    );

    const validPrivateModules = privateModules.filter(
      (module): module is DynamicModule => module !== null,
    );

    const allImports = [
      SharedModule,
      ...baseImports,
      ...featureModules,
      ...validPrivateModules,
    ];

    // const logger = new Logger('aaaa');

    // Helper function để lấy tên module
    const getModuleName = (module: any): string => {
      if (typeof module === 'function') {
        // Cho các module thông thường
        return module.name;
      } else if (
        module &&
        typeof module === 'object' && // Cho DynamicModule
        'module' in module
      ) {
        return module.module.name;
      }

      return 'Unknown Module';
    };

    console.log('Loaded modules:', allImports.map(getModuleName));

    return {
      module: AppModule,
      imports: allImports,
    };
  }
}
