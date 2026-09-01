import { z } from 'zod';

const serverEnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

export type ServerConfig = {
  environment: 'development' | 'test' | 'staging' | 'production';
  port: number;
};

export function loadServerConfig(environment: NodeJS.ProcessEnv): ServerConfig {
  const parsed = serverEnvironmentSchema.parse(environment);

  return {
    environment: parsed.NODE_ENV,
    port: parsed.PORT,
  };
}

