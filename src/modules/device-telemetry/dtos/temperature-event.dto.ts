import { ApiProperty } from '@nestjs/swagger';

import { CloudEventDto } from '../../../interfaces/cloudevent.interface';

export class OilTemperatureData {
  @ApiProperty({
    description: 'Unique identifier of the device',
    example: 'OIL-SENSOR-001',
  })
  deviceId!: string;

  @ApiProperty({
    description: 'Temperature value in Celsius',
    example: 320.2,
    minimum: -50,
    maximum: 500,
  })
  temperature!: number;

  // timestamp: double;
  @ApiProperty({
    description: 'Timestamp of the event',
    example: '2024-01-19T10:00:00Z',
  })
  timestamp!: Date;
}

export class OilTemperatureEvent extends CloudEventDto<OilTemperatureData> {
  @ApiProperty({
    description: 'Data for oil temperature event',
    type: OilTemperatureData,
  })
  data: OilTemperatureData;

  constructor(deviceId: string, temperature: number) {
    super();
    this.data = {
      deviceId,
      temperature,
      timestamp: new Date(),
    };
    this.id = crypto.randomUUID();
    this.time = new Date().toISOString();
    this.source = `/devices/${deviceId}`;
    this.type = 'com.factory.oil.temperature';
  }
}
