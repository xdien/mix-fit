import { AbstractWithIdDto } from '../../../common/dto/abstract-with-id.dto';
import { StringFieldOptional } from '../../../decorators';

export class DeviceRentersDto extends AbstractWithIdDto {
  @StringFieldOptional({ nullable: true })
  rentersId?: string | null;

  @StringFieldOptional({ nullable: true })
  userId?: string | null;
}
