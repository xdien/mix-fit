import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { DeviceTelemetryService } from './device-telemetry.service';

describe('DeviceTelemetryService', () => {
  let service: DeviceTelemetryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceTelemetryService],
    }).compile();

    service = module.get<DeviceTelemetryService>(DeviceTelemetryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
