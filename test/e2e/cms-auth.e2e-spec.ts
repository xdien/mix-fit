import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { CmsAuthModule } from '../../src/modules/cms-auth/cms-auth.module';

describe('CmsAuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CmsAuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/cms-auth/login (POST) - success', async () => {
    const response = await request(app.getHttpServer())
      .post('/cms-auth/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
  });

  it('/cms-auth/login (POST) - failure', async () => {
    await request(app.getHttpServer())
      .post('/cms-auth/login')
      .send({ username: 'wronguser', password: 'wrongpassword' })
      .expect(401);
  });
});
