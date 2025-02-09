import path from 'node:path';

import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';

import { ApiConfigService } from '../shared/services/api-config.service';
import { TranslationService } from './translation.service';

@Module({
  imports: [
    I18nModule.forRootAsync({
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '../i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
