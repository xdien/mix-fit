import type { TelemetryPayloadDto } from '../dtos/telemetry.dto';

export interface IDeviceHandler {
  transformTelemetry(
    payload: TelemetryPayloadDto,
  ): Promise<TelemetryPayloadDto>;
}
