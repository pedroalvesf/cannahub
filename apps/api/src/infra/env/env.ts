import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must have at least 32 characters'),
  PORT: z.coerce.number(),
  SECRET_ENCRYPTION_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  // Comma-separated list of allowed CORS origins (production). Empty/unset in
  // production blocks all cross-origin requests; in dev CORS reflects the origin.
  ALLOWED_ORIGINS: z.string().optional(),
});
