import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TaiKhoanModule } from './../tai-khoan/tai-khoan.module';
import { CmsAuthController } from './cms-auth.controller';
import { CmsAuthService } from './cms-auth.service';
import { CmsAuthStrategy } from './cms-auth.strategy';

@Module({
  imports: [
    forwardRef(() => TaiKhoanModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your_jwt_secret', // Replace with your secret
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [CmsAuthController],
  providers: [CmsAuthService, CmsAuthStrategy],
  exports: [CmsAuthService],
})
export class CmsAuthModule {}
