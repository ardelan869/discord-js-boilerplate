import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';

export const envSchema = z.object({
  CLIENT_TOKEN: z.string(),
  CLIENT_ID: z.string(),
  GUILD_IDS: z
    .string()
    .transform((val) => val.split(',').map((id) => id.trim())),

  NEON_DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  REDIS_TOKEN: z.string()
});

global.dev = process.env.NODE_ENV === 'development';

function getConfigPath() {
  const devEnvPath = join(process.cwd(), '.dev.env');

  if (global.dev && existsSync(devEnvPath)) {
    return devEnvPath;
  }

  return join(process.cwd(), '.env');
}

config({
  path: getConfigPath()
});

global.env = envSchema.parse(process.env);
