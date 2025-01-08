import { ApiProperty } from '@nestjs/swagger';

import {
  EmailField,
  PasswordField,
  PhoneFieldOptional,
  StringField,
} from '../../../decorators';

export class UserRegisterDto {
  @ApiProperty({ required: false })
  @StringField()
  readonly fullName?: string;

  @ApiProperty()
  @EmailField()
  readonly email!: string;

  @ApiProperty({ minLength: 6 })
  @PasswordField({ minLength: 6 })
  readonly password!: string;

  @ApiProperty({ required: false })
  @PhoneFieldOptional()
  phone?: string;
}
