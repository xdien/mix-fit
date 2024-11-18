import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { DeviceTelemetryController } from './device-telemetry.controller';

describe('DeviceTelemetryController', () => {
  let controller: DeviceTelemetryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceTelemetryController],
    }).compile();

    controller = module.get<DeviceTelemetryController>(
      DeviceTelemetryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
