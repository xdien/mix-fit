import type { OnModuleInit } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import type { IDeviceHandlerMetadata } from '../decorators/device-handler.decorator';
import { DEVICE_HANDLER_METADATA } from '../decorators/device-handler.decorator';
import type { IDeviceHandler } from '../interfaces/device-handler.interface';

@Injectable()
export class DeviceRegistryService implements OnModuleInit {
  private deviceHandlers = new Map<string, IDeviceHandler>();

  private readonly logger = new Logger(DeviceRegistryService.name);

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    this.registerHandlers();
  }

  private registerHandlers() {
    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const { instance } = wrapper as { instance: unknown };

      // Check if instance exists and is an object
      if (!instance || typeof instance !== 'object') {
        continue;
      }

      // Get constructor of the instance
      const constructor = instance.constructor;

      // Get metadata using the constructor
      const metadata = Reflect.getMetadata(
        DEVICE_HANDLER_METADATA,
        constructor,
      ) as IDeviceHandlerMetadata | undefined;

      if (metadata?.deviceType) {
        this.deviceHandlers.set(
          metadata.deviceType,
          instance as IDeviceHandler,
        );
        this.logger.debug(
          `Registered handler for device: ${metadata.deviceType}`,
        );
      }
    }
  }

  getHandler(deviceId: string): IDeviceHandler | undefined {
    return this.deviceHandlers.get(deviceId);
  }

  // Helper method to check registered handlers
  getRegisteredDevices(): string[] {
    return [...this.deviceHandlers.keys()];
  }
}
