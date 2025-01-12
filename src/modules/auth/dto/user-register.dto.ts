import { ApiProperty } from '@nestjs/swagger';

import {
  EmailField,
  PasswordField,
  PhoneFieldOptional,
  StringField,
} from '../../../decorators';

export class UserRegisterDto {
  @ApiProperty({ minLength: 5, maxLength: 30, required: true })
  @StringField({ minLength: 5, required: true })
  readonly username!: string;

  @ApiProperty()
  @EmailField()
  readonly email!: string;

  @ApiProperty({ minLength: 6 })
  @PasswordField({ minLength: 6 })
  readonly password!: string;

  @ApiProperty({ required: false })
  @StringField()
  readonly fullName?: string;

  @ApiProperty({ required: false })
  @PhoneFieldOptional()
  phone?: string;
}
