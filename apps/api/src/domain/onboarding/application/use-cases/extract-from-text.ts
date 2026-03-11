import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { AiExtractor, ExtractedFields } from '../ai/ai-extractor';

interface ExtractFromTextRequest {
  input: string;
}

type ExtractFromTextResponse = Either<never, { fields: ExtractedFields }>;

@Injectable()
export class ExtractFromTextUseCase {
  constructor(private aiExtractor: AiExtractor) {}

  async execute({
    input,
  }: ExtractFromTextRequest): Promise<ExtractFromTextResponse> {
    const fields = await this.aiExtractor.extractFromText(input);
    return right({ fields });
  }
}
