import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest';

import { Request } from '../src/requests/request.entity';
import { RequestsModule } from '../src/requests/requests.module';

describe('Request status E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [
          TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: ':memory:',
            entities: [Request],
            synchronize: true,
          }),
          RequestsModule,
        ],
      }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('allows an HR actor to perform a valid status transition', async () => {
    const response = await request(app.getHttpServer())
      .patch('/requests/1/status')
      .set('x-user-role', 'HR')
      .send({
        status: 'In Progress',
      })
      .expect(200);

    expect(response.body.status).toBe('In Progress');

    const savedRequest = await request(app.getHttpServer())
      .get('/requests/1')
      .expect(200);

    expect(savedRequest.body.status).toBe('In Progress');
  });

  it('rejects an Employee actor', async () => {
    await request(app.getHttpServer())
      .patch('/requests/2/status')
      .set('x-user-role', 'Employee')
      .send({
        status: 'Resolved',
      })
      .expect(403);

    const savedRequest = await request(app.getHttpServer())
      .get('/requests/2')
      .expect(200);

    expect(savedRequest.body.status).toBe('In Progress');
  });
});