import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

import type { ICommandPayload } from '../commands/iot-command.interface';

export class CommandPayloadDto implements Omit<ICommandPayload, 'deviceId'> {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Loại thiết bị',
    example: 'LIQUOR-KILN',
  })
  deviceType!: string;

  @ApiProperty({
    description: 'Parameters control device',
    example: { CMD_POWER_PUMP_WATER: true },
    required: false,
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }

    return value;
  })
  @Type(() => Object)
  parameters?: Record<string, unknown>;

  @ApiProperty({
    description: 'Metadata bổ sung',
    example: { location: 'warehouse-1', floor: '2nd' },
    required: false,
    type: 'object',
    additionalProperties: true,
  })
  metadata?: Record<string, unknown>;

  @ApiProperty({
    description: 'Loại repository',
    example: 'mongodb',
    required: false,
  })
  repositoryType?: string;
}
