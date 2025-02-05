import { Injectable } from '@nestjs/common';
import type { TelemetryPayloadDto } from 'modules/iot/dtos/telemetry.dto';

import type { IDeviceHandler } from '../interfaces/device-handler.interface';

@Injectable()
export abstract class BaseDeviceHandler implements IDeviceHandler {
  abstract transformTelemetry(payload: never): Promise<TelemetryPayloadDto>;

  protected validatePayload(_payload: TelemetryPayloadDto): boolean {
    // Implement common validation logic
    return true;
  }
}
