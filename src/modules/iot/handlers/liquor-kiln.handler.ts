import { Injectable } from '@nestjs/common';

import { DeviceCommandType } from '../../../constants/device-command-type';
import { DeviceHandler } from '../decorators/device-handler.decorator';
import type { MetricDto, TelemetryPayloadDto } from '../dtos/telemetry.dto';
import { BaseDeviceHandler } from './base-device.handler';

@Injectable()
@DeviceHandler({
  deviceType: DeviceCommandType.LIQUOR_KILN,
  description: 'Liquor Kiln device data handler',
})
export class LiquorKilnHandler extends BaseDeviceHandler {
  transformTelemetry(payload: any): Promise<TelemetryPayloadDto> {
    // Custom transformation logic for ESP8266_001
    const metrics: MetricDto[] = [
      {
        sensorId: payload.idNau,
        name: 'current',
        value: payload.a,
        unit: 'ampere',
        metadata: { type: 'electrical' },
      },
      {
        sensorId: payload.idNau,
        name: 'power',
        value: payload.w,
        unit: 'watt',
        metadata: { type: 'electrical' },
      },
      {
        sensorId: payload.idNau,
        name: 'voltage',
        value: payload.v,
        unit: 'volt',
        metadata: { type: 'electrical' },
      },
      {
        sensorId: payload.idNau,
        name: 'frequency',
        value: payload.f,
        unit: 'hertz',
        metadata: { type: 'electrical' },
      },
      {
        sensorId: payload.idNau,
        name: 'kilowatt_hour',
        value: payload.kw,
        unit: 'kWh',
        metadata: { type: 'energy' },
      },
      {
        sensorId: payload.idNau,
        name: 'oil_temperature',
        value: payload.tDau,
        unit: 'celsius',
        metadata: { type: 'temperature' },
      },
      {
        sensorId: payload.idNau,
        name: 'water_temperature',
        value: payload.tNuoc,
        unit: 'celsius',
        metadata: { type: 'temperature' },
      },
    ];

    return Promise.resolve({
      deviceId: payload.device_id,
      timestamp: new Date(Number.parseInt(payload.tm) * 1000), // Assuming timestamp is in seconds
      metrics,
    });
  }
}
