import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';

import { RequestIntakeService } from './request-intake.service';

describe('Request Intake AI Evaluation', () => {
  let service: RequestIntakeService;

  beforeEach(() => {
    service = new RequestIntakeService();
  });

  it('handles a clear IT hardware request', async () => {
    const result = await service.suggest('My laptop will not start');

    expect(result.serviceArea).toBe('IT');
    expect(result.category).toBe('Hardware Issue');
  });

  it('handles a clear HR request', async () => {
    const result = await service.suggest(
      'I need an employment certificate',
    );

    expect(result.serviceArea).toBe('HR');
    expect(result.category).toBe('Employment Certificate');
  });

  it('handles a thin password request', async () => {
    const result = await service.suggest('Password');

    expect(result.serviceArea).toBe('IT');
    expect(result.category).toBe('Password/Account Issue');
  });

  it('handles an ambiguous account request with a bounded result', async () => {
    const result = await service.suggest(
      'I need help with my account',
    );

    expect(['HR', 'IT']).toContain(result.serviceArea);
    expect(result.title).toBeTruthy();
  });

  it('rejects empty input', async () => {
    await expect(service.suggest('')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns only product-owned fields', async () => {
    const result = await service.suggest(
      'Please install software on my laptop',
    );

    expect(Object.keys(result).sort()).toEqual(
      ['category', 'serviceArea', 'title'].sort(),
    );
  });
});