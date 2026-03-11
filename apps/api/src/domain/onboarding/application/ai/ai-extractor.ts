export interface ExtractedFields {
  condition?: string;
  accountType?: string;
  experience?: string;
  preferredForm?: string;
  hasPrescription?: boolean;
  observations?: string;
}

export abstract class AiExtractor {
  abstract extractFromText(userInput: string): Promise<ExtractedFields>;
  abstract generateSummary(
    fields: Record<string, unknown>,
  ): Promise<string>;
}
