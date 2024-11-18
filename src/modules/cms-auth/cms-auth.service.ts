import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { RoleType } from '../../constants';
import { TokenType } from '../../constants';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import type { TaiKhoanEntity } from '../tai-khoan/tai-khoan.entity';
import { TaiKhoanService } from '../tai-khoan/tai-khoan.service';
import type { CmsLoginDto } from './dtos/cms-login.dto';

@Injectable()
export class CmsAuthService {
  constructor(
    private taiKhoanService: TaiKhoanService,
    private jwtService: JwtService,
    private configService: ApiConfigService,
  ) {}

  async validateUser(loginDto: CmsLoginDto): Promise<TaiKhoanEntity> {
    const { username, password } = loginDto;
    // raw query `select password(`password`) from tai_khoan where username = ${username}`

    const user = await this.taiKhoanService.findOne({ username, password });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async createAccessToken(data: {
    role: RoleType;
    userId: string;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,

      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }
}
