import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { TaiKhoanController } from './tai-khoan.controller';

describe('TaiKhoanController', () => {
  let controller: TaiKhoanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaiKhoanController],
    }).compile();

    controller = module.get<TaiKhoanController>(TaiKhoanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
