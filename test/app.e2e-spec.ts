import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './test.utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTestApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('hello world');
  });
});
