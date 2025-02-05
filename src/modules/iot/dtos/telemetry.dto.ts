import { ApiProperty } from '@nestjs/swagger';

import type { IMetric, ITelemetryPayload } from '../telemetry.types';
import { Metadata, MetricValue } from '../telemetry.types';

export class MetricDto implements IMetric {
  // sensor_id: string;
  @ApiProperty({
    description: 'Unique identifier of the sensor',
    example: 'sensor-001',
    required: true,
  })
  sensorId!: string;

  @ApiProperty({
    description: 'Name of the metric',
    example: 'temperature',
    required: false,
  })
  name!: string;

  @ApiProperty({
    description: 'Value of the metric',
    example: 25.5,
    required: true,
  })
  value!: MetricValue;

  @ApiProperty({
    description: 'Unit of the metric',
    example: { unit: 'celsius' },
    required: false,
  })
  unit?: string;

  @ApiProperty({
    description: 'Metadata of the metric',
    example: { location: 'living-room' },
    required: false,
  })
  metadata?: Metadata;
}

export class TelemetryPayloadDto implements ITelemetryPayload {
  @ApiProperty({
    description: 'Unique identifier of the device',
    example: 'device-001',
  })
  deviceId!: string;

  @ApiProperty({
    description: 'Type of the device to which the telemetry data belongs',
    example: 'sensor-001',
    required: false,
  })
  deviceType?: string;

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
