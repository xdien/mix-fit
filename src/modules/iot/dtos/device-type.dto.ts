import { ApiProperty } from '@nestjs/swagger';

import { DeviceCommandType } from '../../../constants/device-command-type';

export class DeviceTypeDto {
  @ApiProperty({
    enum: DeviceCommandType,
    description: 'Available device types',
    example: 'LIQUOR-KILN',
  })
  type: string | undefined;
}
