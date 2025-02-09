import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { ApiConfigService } from './services/api-config.service';
import { AwsS3Service } from './services/aws-s3.service';
import { GeneratorService } from './services/generator.service';
import { ValidatorService } from './services/validator.service';

const providers: Provider[] = [
  ApiConfigService,
  ValidatorService,
  AwsS3Service,
  GeneratorService,
];

@Global()
@Module({
  providers,
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      // Thêm ConfigModule vào đây
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
