import { IntakeSuggestion } from './request-intake.types';

export interface AiProvider {
  suggest(requestText: string): Promise<IntakeSuggestion>;
}