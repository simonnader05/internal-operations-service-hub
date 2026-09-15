import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Request } from './request.entity';
import { RequestStatus } from './request-status.enum';
import { RequestsService } from './requests.service';

describe('RequestsService', () => {
  let service: RequestsService;
  let repository: Repository<Request>;

  beforeEach(async () => {
    const repositoryMock = {
      count: vi.fn(),
      save: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: getRepositoryToken(Request),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    repository = module.get<Repository<Request>>(
      getRepositoryToken(Request),
    );
  });

  it('rejects changing a Closed request to In Progress', async () => {
    vi.mocked(repository.findOne).mockResolvedValue({
      id: '5',
      number: 'REQ-1005',
      title: 'Employment certificate',
      serviceArea: 'HR',
      status: RequestStatus.Closed,
      createdAt: '2026-08-20T08:00:00.000Z',
      updatedAt: '2026-08-28T16:00:00.000Z',
    });

    await expect(
      service.updateStatus('5', RequestStatus.InProgress),
    ).rejects.toThrow(BadRequestException);

    expect(repository.save).not.toHaveBeenCalled();
  });
});