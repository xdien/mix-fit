import type { TelemetryPayloadDto } from '../dto/telemetry-payload.dto';

export interface IDeviceHandler {
  transformTelemetry(
    payload: TelemetryPayloadDto,
  ): Promise<TelemetryPayloadDto>;
}
