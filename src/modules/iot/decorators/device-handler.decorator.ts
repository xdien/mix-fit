import { SetMetadata } from '@nestjs/common';

import type { DeviceCommandType } from '../../../constants/device-command-type';

export const DEVICE_HANDLER_METADATA = 'device_handler';

export interface IDeviceHandlerMetadata {
  deviceType: DeviceCommandType;
  description?: string;
}

export const DeviceHandler = (metadata: IDeviceHandlerMetadata) =>
  SetMetadata(DEVICE_HANDLER_METADATA, metadata);
