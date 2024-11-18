import { AbstractWithIdDto } from '../../../common/dto/abstract-with-id.dto';
import {
  EmailFieldOptional,
  PhoneFieldOptional,
  StringFieldOptional,
} from '../../../decorators';

export class TaiKhoanDto extends AbstractWithIdDto {
  @StringFieldOptional({ nullable: true })
  username!: string;

  //   @EnumFieldOptional(() => RoleType)
  //   role?: RoleType;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone?: string | null;

  //   constructor(taiKhoan: TaiKhoanEntity) {
  //     super(taiKhoan);
  //     this.username = taiKhoan.username;

  //     //     this.role = taiKhoan.role;
  //     this.email = taiKhoan.email;
  //     this.phone = taiKhoan.tel;
  //   }
}
