import { ApiProperty } from '@nestjs/swagger';

import { AbstractWithIdDto } from '../../../common/dto/abstract-with-id.dto';
import { RoleType } from '../../../constants';
import {
  BooleanFieldOptional,
  EmailField,
  EnumField,
  PhoneFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import type { UserEntity } from '../user.entity';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractWithIdDto {
  @StringFieldOptional({ nullable: true })
  fullName?: string | null;

  @StringField()
  username!: string;

  @ApiProperty({
    enum: RoleType,
    isArray: true, // fix: Null check operator used on a null value
    description: 'User roles array',
  })
  @EnumField(() => RoleType)
  roles!: [RoleType];

  @EmailField()
  email!: string | null | undefined;

  @ApiProperty({ nullable: true })
  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone?: string | null;

  @BooleanFieldOptional({ default: true })
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.fullName = user.fullName;
    this.roles = Array.isArray(user.roles) ? user.roles : [user.roles];
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.isActive = options?.isActive;
    this.username = user.username;
  }
}
