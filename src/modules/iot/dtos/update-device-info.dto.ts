import { StringFieldOptional } from '../../../decorators';

export class UpdateDeviceInfoDto {
  @StringFieldOptional()
  deviceType: string | undefined;

  @StringFieldOptional()
  version: string | undefined;
}
