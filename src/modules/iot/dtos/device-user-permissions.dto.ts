import { AbstractWithIdDto } from '../../../common/dto/abstract-with-id.dto';
import { StringFieldOptional } from '../../../decorators';

export class DeviceUserPermissionsDto extends AbstractWithIdDto {
  @StringFieldOptional({ nullable: true })
  deviceId?: string | null;

  @StringFieldOptional({ nullable: true })
  userId?: string | null;
}
