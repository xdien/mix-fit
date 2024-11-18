import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { IotControlController } from './iot-control.controller';

describe('IotControlController', () => {
  let controller: IotControlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IotControlController],
    }).compile();

    controller = module.get<IotControlController>(IotControlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
