import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { CmsAuthService } from './cms-auth.service';
import { CmsLoginDto } from './dtos/cms-login.dto';
import { CmsLoginPayloadDto } from './dtos/cms-login-payload.dto';

@Controller('cms-auth')
@ApiTags('cms')
export class CmsAuthController {
  constructor(private authService: CmsAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CmsLoginPayloadDto,
    description: 'User info with access token',
  })
  async login(@Body() loginDto: CmsLoginDto) {
    const user = await this.authService.validateUser(loginDto);
    const token = await this.authService.createAccessToken({
      userId: user.userId,
      role: RoleType.ADMIN,
    });

    return new CmsLoginPayloadDto(user, token);
  }
}
