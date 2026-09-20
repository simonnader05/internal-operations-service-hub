import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

import { AiProvider } from './ai-provider';
import { IntakeSuggestion } from './request-intake.types';
import { LocalAiProvider } from './local-ai.provider';
import { OpenRouterAiProvider } from './openrouter-ai.provider';

@Injectable()
export class RequestIntakeService {
  private readonly allowedHrCategories = [
    'Annual Leave',
    'Payroll Inquiry',
    'Employment Certificate',
    'Overtime',
    'HR Inquiry',
  ];

  private readonly allowedItCategories = [
    'Hardware Issue',
    'Software Installation',
    'Access Request',
    'Password/Account Issue',
    'Email Issue',
  ];

  private readonly aiProvider: AiProvider;

  constructor() {
    /*
     * Normal tests and local development remain deterministic.
     *
     * To use the real OpenRouter AI provider:
     * AI_PROVIDER=openrouter
     * OPENROUTER_API_KEY=<your key>
     */
    if (
      process.env.AI_PROVIDER === 'openrouter' &&
      process.env.OPENROUTER_API_KEY
    ) {
      this.aiProvider = new OpenRouterAiProvider();
    } else {
      this.aiProvider = new LocalAiProvider();
    }
  }

  async suggest(requestText: string): Promise<IntakeSuggestion> {
    if (!requestText || !requestText.trim()) {
      throw new BadRequestException('Request text is required');
    }

    try {
      const candidate = await this.aiProvider.suggest(requestText);

      this.validateSuggestion(candidate);

      return {
        serviceArea: candidate.serviceArea,
        category: candidate.category,
        title: candidate.title.trim(),
      };
    } catch (error) {
      console.error('Request intake provider error:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServiceUnavailableException(
        'Request suggestion is temporarily unavailable',
      );
    }
  }

  private validateSuggestion(candidate: IntakeSuggestion): void {
    if (!candidate.title || !candidate.title.trim()) {
      throw new BadRequestException('AI suggestion title is invalid');
    }

    if (candidate.serviceArea === 'HR') {
      if (!this.allowedHrCategories.includes(candidate.category)) {
        throw new BadRequestException('AI suggestion category is invalid');
      }

      return;
    }

    if (candidate.serviceArea === 'IT') {
      if (!this.allowedItCategories.includes(candidate.category)) {
        throw new BadRequestException('AI suggestion category is invalid');
      }

      return;
    }

    throw new BadRequestException('AI suggestion service area is invalid');
  }
}