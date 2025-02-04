import { SetMetadata } from '@nestjs/common';

export const DEVICE_HANDLER_METADATA = 'device_handler';

export interface IDeviceHandlerMetadata {
  deviceId: string;
  description?: string;
}

export const DeviceHandler = (metadata: IDeviceHandlerMetadata) =>
  SetMetadata(DEVICE_HANDLER_METADATA, metadata);
