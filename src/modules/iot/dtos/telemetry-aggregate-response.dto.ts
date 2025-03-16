import { ApiProperty } from '@nestjs/swagger';

export class TelemetryAggregateResponseDto {
  @ApiProperty({
    description: 'Timestamp bucket',
    example: '2024-02-23T10:00:00.000Z',
    type: String,
  })
  time!: string;

  @ApiProperty({
    description: 'Name of the metric',
    example: 'temperature',
    type: String,
  })
  metricName!: string;

  @ApiProperty({
    description: 'Average value of the metric in this time bucket',
    example: 25.7,
    type: Number,
  })
  avgValue?: number;

  @ApiProperty({
    description: 'Maximum value of the metric in this time bucket',
    example: 27.3,
    type: Number,
  })
  maxValue?: number;

  @ApiProperty({
    description: 'Minimum value of the metric in this time bucket',
    example: 24.1,
    type: Number,
  })
  minValue?: number;

  @ApiProperty({
    description: 'Number of samples in this time bucket',
    example: 60,
    type: Number,
  })
  sampleCount?: number;
}
