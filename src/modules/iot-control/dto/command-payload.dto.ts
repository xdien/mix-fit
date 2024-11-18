import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

import type { ICommandPayload } from '../commands/iot-command.interface';

export class CommandPayloadDto implements ICommandPayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Device ID',
    example: 'esp8266_001',
  })
  deviceId!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Loại thiết bị',
    example: 'LIQUOR-KILN',
  })
  deviceType!: string;

  @IsObject()
  @ApiProperty({
    description: 'Các tham số cho lệnh',
    example: {
      brightness: 100,
      color: '#FF0000',
    },
    additionalProperties: true,
  })
  parameters?: Record<string, unknown>;
}
