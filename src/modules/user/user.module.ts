import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TranslationModule } from '../../translation/translation.module';
import { CreateSettingsHandler } from './commands/create-settings.command';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserSettingsEntity } from './user-settings.entity';

const handlers = [CreateSettingsHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserSettingsEntity]),
    TranslationModule,
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, ...handlers],
})
export class UserModule {}
