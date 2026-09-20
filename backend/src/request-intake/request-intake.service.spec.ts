import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';

import { RequestIntakeService } from './request-intake.service';

describe('RequestIntakeService', () => {
  let service: RequestIntakeService;

  beforeEach(() => {
    service = new RequestIntakeService();
  });

  it('suggests IT Hardware Issue for a laptop problem', async () => {
    const result = await service.suggest('My laptop will not start');

    expect(result).toEqual({
      serviceArea: 'IT',
      category: 'Hardware Issue',
      title: 'My laptop will not start',
    });
  });

  it('suggests HR Employment Certificate', async () => {
    const result = await service.suggest(
      'I need an employment certificate',
    );

    expect(result.serviceArea).toBe('HR');
    expect(result.category).toBe('Employment Certificate');
  });

  it('rejects empty request text', async () => {
    await expect(service.suggest('')).rejects.toThrow(
      BadRequestException,
    );
  });
});