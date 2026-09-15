import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it } from 'vitest';

import { Request } from './request.entity';
import { RequestStatus } from './request-status.enum';
import { RequestsModule } from './requests.module';
import { RequestsService } from './requests.service';

describe('RequestsService SQLite integration', () => {
  let module: TestingModule;
  let service: RequestsService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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

    service = module.get<RequestsService>(RequestsService);

    await service.onModuleInit();
  });

  it('persists a valid status transition in SQLite', async () => {
    const before = await service.findOne('1');

    expect(before.status).toBe(RequestStatus.Pending);

    await service.updateStatus('1', RequestStatus.InProgress);

    const after = await service.findOne('1');

    expect(after.status).toBe(RequestStatus.InProgress);
  });
});