import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { IFile } from '../../interfaces';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import type { UserRegisterDto } from './dto/user-register.dto';
// import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      roles: userEntity.roles,
    });

    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  @ApiOperation({ summary: 'Register new user' }) // Thêm mô tả operation
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password', 'username'],
      properties: {
        username: {
          type: 'string',
          nullable: false,
          example: 'username',
        },
        email: {
          type: 'string',
          example: 'john@example.com',
        },
        password: {
          type: 'string',
          example: '******',
        },
        fullName: {
          type: 'string',
          example: 'John Doe',
        },
        phone: {
          type: 'string',
          nullable: true,
          example: '+1234567890',
        },
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'User avatar file',
        },
      },
    },
  })
  async userRegister(
    @Body() body: unknown,
    @UploadedFile() file?: IFile,
  ): Promise<UserDto> {
    const userRegisterDto = {
      ...(body as UserRegisterDto),
    };

    const user = await this.userService.findByUsernameOrEmail({
      email: userRegisterDto.email,
    });

    if (user) {
      throw new ConflictException(
        `User already exists  ${JSON.stringify(userRegisterDto.email)}`,
      );
    }

    const createdUser = await this.userService.createUser(
      userRegisterDto,
      file,
    );

    return createdUser.toDto({
      isActive: true,
    });
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }
}
