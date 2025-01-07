import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
    description: 'Các tham số bổ sung',
    example: { temperature: 25, humidity: 80 },
    required: false,
    type: 'object',
    additionalProperties: true,
  })
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
