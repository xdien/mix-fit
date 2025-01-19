import { ApiProperty } from '@nestjs/swagger';

export class CloudEventDto<T = unknown> {
  @ApiProperty({
    description: 'The type of event',
    example: 'com.example.event',
  })
  type!: string;

  @ApiProperty({
    description: 'The source of the event',
    example: 'https://example.com/events',
  })
  source!: string;

  @ApiProperty({
    description: 'The unique identifier of the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'The time the event occurred',
    example: '2024-01-19T10:00:00Z',
  })
  time!: string;

  @ApiProperty({
    description: 'The data associated with the event',
    type: 'object',
  })
  data!: T;
}

export type CloudEvent<T = unknown> = CloudEventDto<T>;
