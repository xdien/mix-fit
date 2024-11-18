import { ClassField } from '../../../decorators';
import { TokenPayloadDto } from '../../auth/dto/token-payload.dto';
import { TaiKhoanEntity } from '../../tai-khoan/tai-khoan.entity';

export class CmsLoginPayloadDto {
  @ClassField(() => TaiKhoanEntity)
  user: TaiKhoanEntity;

  @ClassField(() => TokenPayloadDto)
  token: TokenPayloadDto;

  constructor(user: TaiKhoanEntity, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
