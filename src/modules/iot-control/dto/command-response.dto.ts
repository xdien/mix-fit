import { ApiProperty } from '@nestjs/swagger';
import type { JobState } from 'bullmq';

import type { ICommandResponse } from '../commands/iot-command.interface';

export class CommandResponseDto implements ICommandResponse {
  @ApiProperty({
    description: 'ID of command',
    example: '5f4b5d1f-1c8c-4b3b-9f3a-2d5e6c9b4b3b',
  })
  commandId!: string;

  @ApiProperty({
    description: 'Status of command',
    example: 'completed',
  })
  status!: JobState | 'unknown';

  @ApiProperty({
    description: 'Result of command',
    required: false,
  })
  result?: unknown;

  @ApiProperty({
    description: 'Time when command was executed',
    required: false,
    nullable: true,
  })
  executedAt?: Date;

  @ApiProperty({
    description: 'Error message if command failed',
    required: false,
    nullable: true,
  })
  error?: string | undefined;
}
