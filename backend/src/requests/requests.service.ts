import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ALLOWED_TRANSITIONS,
  isRequestStatus,
  RequestStatus,
} from './request-status.enum';

import { Request } from './request.entity';

@Injectable()
export class RequestsService implements OnModuleInit {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async onModuleInit() {
    const count = await this.requestRepository.count();

    if (count === 0) {
      await this.requestRepository.save([
        {
          id: '1',
          number: 'REQ-1001',
          title: 'Annual leave request',
          serviceArea: 'HR',
          status: RequestStatus.Pending,
          createdAt: '2026-09-01T08:00:00.000Z',
          updatedAt: '2026-09-01T08:00:00.000Z',
        },
        {
          id: '2',
          number: 'REQ-1002',
          title: 'Laptop not starting',
          serviceArea: 'IT',
          status: RequestStatus.InProgress,
          createdAt: '2026-09-02T09:00:00.000Z',
          updatedAt: '2026-09-03T10:00:00.000Z',
        },
        {
          id: '3',
          number: 'REQ-1003',
          title: 'Overtime for last week',
          serviceArea: 'HR',
          status: RequestStatus.Resolved,
          createdAt: '2026-09-01T11:00:00.000Z',
          updatedAt: '2026-09-04T12:00:00.000Z',
          resolvedAt: '2026-09-04T12:00:00.000Z',
        },
        {
          id: '4',
          number: 'REQ-1004',
          title: 'Software installation',
          serviceArea: 'IT',
          status: RequestStatus.Rejected,
          createdAt: '2026-09-02T13:00:00.000Z',
          updatedAt: '2026-09-03T14:00:00.000Z',
        },
        {
          id: '5',
          number: 'REQ-1005',
          title: 'Employment certificate',
          serviceArea: 'HR',
          status: RequestStatus.Closed,
          createdAt: '2026-08-20T08:00:00.000Z',
          updatedAt: '2026-08-28T16:00:00.000Z',
          resolvedAt: '2026-08-27T15:00:00.000Z',
          closedAt: '2026-08-28T16:00:00.000Z',
        },
      ]);
    }
  }

  async findAll(): Promise<Request[]> {
    return this.requestRepository.find();
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Request ${id} was not found`);
    }

    return request;
  }

  async updateStatus(
    id: string,
    nextStatus: string,
  ): Promise<Request> {
    const request = await this.findOne(id);

    if (request.status === RequestStatus.Closed) {
      throw new BadRequestException(
        'A closed request cannot be modified',
      );
    }

    if (!nextStatus) {
      throw new BadRequestException('Status is required');
    }

    if (!isRequestStatus(nextStatus)) {
      throw new BadRequestException(
        `Invalid status: ${nextStatus}`,
      );
    }

    if (
      !ALLOWED_TRANSITIONS[request.status].includes(nextStatus)
    ) {
      throw new BadRequestException(
        `Cannot transition from ${request.status} to ${nextStatus}`,
      );
    }

    const now = new Date().toISOString();

    request.status = nextStatus;
    request.updatedAt = now;

    if (nextStatus === RequestStatus.Resolved) {
      request.resolvedAt = now;
    }

    if (nextStatus === RequestStatus.Closed) {
      request.closedAt = now;
    }

    return this.requestRepository.save(request);
  }
}