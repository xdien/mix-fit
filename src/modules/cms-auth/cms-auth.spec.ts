import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { Cmsauth } from './cms-auth';

describe('Cmsauth', () => {
  let provider: Cmsauth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Cmsauth],
    }).compile();

    provider = module.get<Cmsauth>(Cmsauth);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
