import { Injectable } from '@nestjs/common';
import type { TelemetryPayloadDto } from 'modules/device-telemetry/dtos/telemetry.dto';

import type { IDeviceHandler } from '../interfaces/device-handler.interface';

@Injectable()
export abstract class BaseDeviceHandler implements IDeviceHandler {
  abstract transformTelemetry(
    payload: TelemetryPayloadDto,
  ): Promise<TelemetryPayloadDto>;

  protected validatePayload(payload: TelemetryPayloadDto): boolean {
    // Implement common validation logic
    return true;
  }
}
