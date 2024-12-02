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

  @EnumField(() => RoleType)
  roles!: [RoleType];

  @EmailField()
  email!: string | null | undefined;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.fullName = user.fullName;
    this.roles = user.roles;
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.isActive = options?.isActive;
  }
}
