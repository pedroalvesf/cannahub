import { Module } from '@nestjs/common';
import { AiExtractor } from '@/domain/onboarding/application/ai/ai-extractor';
import { ClaudeAiExtractor } from './claude-ai-extractor';
import { EnvModule } from '@/infra/env/env.module';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: AiExtractor,
      useClass: ClaudeAiExtractor,
    },
  ],
  exports: [AiExtractor],
})
export class AiModule {}
