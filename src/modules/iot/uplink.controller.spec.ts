import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { UplinkController } from './uplink.controller';

describe('UplinkController', () => {
  let controller: UplinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UplinkController],
    }).compile();

    controller = module.get<UplinkController>(UplinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
