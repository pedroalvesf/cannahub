import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import {
  AiExtractor,
  ExtractedFields,
} from '@/domain/onboarding/application/ai/ai-extractor';
import { EnvService } from '@/infra/env/env.service';
import { EXTRACTION_PROMPT, SUMMARY_PROMPT } from './prompts';

@Injectable()
export class ClaudeAiExtractor implements AiExtractor {
  private client: Anthropic;

  constructor(private env: EnvService) {
    this.client = new Anthropic({
      apiKey: this.env.get('ANTHROPIC_API_KEY'),
    });
  }

  async extractFromText(userInput: string): Promise<ExtractedFields> {
    const response = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: EXTRACTION_PROMPT,
      messages: [{ role: 'user', content: userInput }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '{}';

    try {
      return JSON.parse(text) as ExtractedFields;
    } catch {
      return {};
    }
  }

  async generateSummary(fields: Record<string, unknown>): Promise<string> {
    const response = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SUMMARY_PROMPT,
      messages: [
        { role: 'user', content: JSON.stringify(fields, null, 2) },
      ],
    });

    return response.content[0].type === 'text'
      ? response.content[0].text
      : 'Não foi possível gerar o resumo.';
  }
}
