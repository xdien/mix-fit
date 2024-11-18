import { ApiProperty } from '@nestjs/swagger';

import type { IMetric, ITelemetryPayload } from '../telemetry.types';

export class MetricDto implements IMetric {
  @ApiProperty({
    description: 'Name of the metric',
    example: 'temperature',
  })
  name!: string;

  @ApiProperty({
    description: 'Value of the metric',
    example: 25.5,
  })
  value!: number;
}

export class TelemetryPayloadDto implements ITelemetryPayload {
  @ApiProperty({
    description: 'Unique identifier of the device',
    example: 'device-001',
  })
  device_id!: string;

  @ApiProperty({
    description: 'Timestamp when the telemetry data was collected',
    example: '2024-03-10T15:30:00Z',
  })
  timestamp?: Date;

  @ApiProperty({
    description: 'Array of metrics with their values',
    type: [MetricDto],
  })
  metrics!: MetricDto[];
}
