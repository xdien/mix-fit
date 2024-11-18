import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { IotControlService } from './iot-control.service';

describe('IotControlService', () => {
  let service: IotControlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IotControlService],
    }).compile();

    service = module.get<IotControlService>(IotControlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
