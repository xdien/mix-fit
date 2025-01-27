import { StringFieldOptional } from '../../../decorators';

export class AddDeviceDto {
  @StringFieldOptional({ nullable: false })
  deviceId!: string;
}
