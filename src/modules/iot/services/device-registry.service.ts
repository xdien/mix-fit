import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';

import type { IDeviceHandlerMetadata } from '../decorators/device-handler.decorator';
import { DEVICE_HANDLER_METADATA } from '../decorators/device-handler.decorator';
import type { IDeviceHandler } from '../interfaces/device-handler.interface';

@Injectable()
export class DeviceRegistryService implements OnModuleInit {
  private deviceHandlers = new Map<string, IDeviceHandler>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  async onModuleInit() {
    await this.registerHandlers();
  }

  private async registerHandlers() {
    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const { instance } = wrapper;

      if (!instance || !Object.getPrototypeOf(instance)) {
        continue;
      }

      const metadata = Reflect.getMetadata(
        DEVICE_HANDLER_METADATA,
        (instance as Record<string, unknown>).constructor,
      ) as IDeviceHandlerMetadata;

      if (metadata.deviceId) {
        this.deviceHandlers.set(metadata.deviceId, instance as IDeviceHandler);
      }
    }
  }

  getHandler(deviceId: string): IDeviceHandler | undefined {
    return this.deviceHandlers.get(deviceId);
  }
}
