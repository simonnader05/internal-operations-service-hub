import { Injectable } from '@nestjs/common';

import { AiProvider } from './ai-provider';
import { IntakeSuggestion } from './request-intake.types';

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

@Injectable()
export class OpenRouterAiProvider implements AiProvider {
  async suggest(requestText: string): Promise<IntakeSuggestion> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          temperature: 0,
          messages: [
            {
              role: 'system',
              content: `
You classify employee service requests.

Return JSON only.

Allowed serviceArea values:
- HR
- IT

Allowed HR categories:
- Annual Leave
- Payroll Inquiry
- Employment Certificate
- Overtime
- HR Inquiry

Allowed IT categories:
- Hardware Issue
- Software Installation
- Access Request
- Password/Account Issue
- Email Issue

Return exactly this structure:

{
  "serviceArea": "HR or IT",
  "category": "one allowed category",
  "title": "short clear title"
}

Do not return markdown.
Do not add extra fields.
Do not create or modify any request.
              `.trim(),
            },
            {
              role: 'user',
              content: requestText,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `OpenRouter request failed with status ${response.status}`,
      );
    }

    const data = (await response.json()) as OpenRouterResponse;

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('OpenRouter returned no content');
    }

    const cleaned = content
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned) as IntakeSuggestion;

    return parsed;
  }
}