import {
  AiExtractor,
  ExtractedFields,
} from '@/domain/onboarding/application/ai/ai-extractor';

export class FakeAiExtractor implements AiExtractor {
  async extractFromText(userInput: string): Promise<ExtractedFields> {
    const fields: ExtractedFields = {};
    const input = userInput.toLowerCase();

    if (input.includes('epilepsia') || input.includes('convuls'))
      fields.condition = 'epilepsy';
    if (input.includes('dor')) fields.condition = 'chronic_pain';
    if (input.includes('ansiedade')) fields.condition = 'anxiety';
    if (input.includes('nunca')) fields.experience = 'never';

    return fields;
  }

  async generateSummary(fields: Record<string, unknown>): Promise<string> {
    return `Resumo do perfil: condição ${fields.condition ?? 'não informada'}.`;
  }
}
