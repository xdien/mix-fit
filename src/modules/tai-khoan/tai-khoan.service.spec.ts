import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { TaiKhoanService } from './tai-khoan.service';

describe('TaiKhoanService', () => {
  let service: TaiKhoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaiKhoanService],
    }).compile();

    service = module.get<TaiKhoanService>(TaiKhoanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
