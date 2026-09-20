import { Injectable } from '@nestjs/common';

import { AiProvider } from './ai-provider';
import { IntakeSuggestion } from './request-intake.types';

@Injectable()
export class LocalAiProvider implements AiProvider {
  async suggest(requestText: string): Promise<IntakeSuggestion> {
    const text = requestText.toLowerCase();

    if (
      text.includes('laptop') ||
      text.includes('computer') ||
      text.includes('software') ||
      text.includes('password') ||
      text.includes('email') ||
      text.includes('access')
    ) {
      return {
        serviceArea: 'IT',
        category: this.getItCategory(text),
        title: this.buildTitle(requestText),
      };
    }

    return {
      serviceArea: 'HR',
      category: this.getHrCategory(text),
      title: this.buildTitle(requestText),
    };
  }

  private getItCategory(text: string): string {
    if (text.includes('password')) {
      return 'Password/Account Issue';
    }

    if (text.includes('software')) {
      return 'Software Installation';
    }

    if (text.includes('access')) {
      return 'Access Request';
    }

    if (text.includes('email')) {
      return 'Email Issue';
    }

    return 'Hardware Issue';
  }

  private getHrCategory(text: string): string {
    if (text.includes('leave')) {
      return 'Annual Leave';
    }

    if (text.includes('payroll') || text.includes('salary')) {
      return 'Payroll Inquiry';
    }

    if (text.includes('certificate')) {
      return 'Employment Certificate';
    }

    if (text.includes('overtime')) {
      return 'Overtime';
    }

    return 'HR Inquiry';
  }

  private buildTitle(requestText: string): string {
    const clean = requestText.trim();

    if (clean.length <= 60) {
      return clean;
    }

    return `${clean.slice(0, 57)}...`;
  }
}