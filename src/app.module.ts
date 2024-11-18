import './boilerplate.polyfill';

import path from 'node:path';

import { BullModule } from '@nestjs/bullmq';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';

import { AuthModule } from './modules/auth/auth.module';
import { EventsGateway } from './modules/chat/events-gateway';
import { CmsAuthModule } from './modules/cms-auth/cms-auth.module';
import { DeviceTelemetryModule } from './modules/device-telemetry/device-telemetry.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { IotModule } from './modules/iot/iot.module';
import { IotControlModule } from './modules/iot-control/iot-control.module';
import { PostModule } from './modules/post/post.module';
import { TaiKhoanModule } from './modules/tai-khoan/tai-khoan.module';
import { UserModule } from './modules/user/user.module';
import { MqttModule } from './mqtt/mqtt.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        ...configService.postgresConfig,
      }),
      inject: [ApiConfigService],
    }),
    I18nModule.forRootAsync({
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: () => {
        const logger: Logger = new Logger('BullModule');

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
            // Ping test
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
    HealthCheckerModule,
    MqttModule,
    IotModule,
    TaiKhoanModule,
    CmsAuthModule,
    IotControlModule,
    DeviceTelemetryModule,
  ],
  providers: [EventsGateway],
  controllers: [],
})
export class AppModule {}
