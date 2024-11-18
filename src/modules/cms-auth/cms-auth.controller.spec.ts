import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { CmsAuthController as CmsAuthController } from './cms-auth.controller';

describe('CmsAuthController', () => {
  let controller: CmsAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CmsAuthController],
    }).compile();

    controller = module.get<CmsAuthController>(CmsAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
