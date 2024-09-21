import { config } from 'dotenv';
import { join } from 'path';
import { z } from 'zod';

export const envSchema = z.object({
  CLIENT_TOKEN: z.string(),
  CLIENT_ID: z.string(),
  GUILD_IDS: z
    .string()
    .transform((val) => val.split(',').map((id) => id.trim()))
});

global.dev = process.env.NODE_ENV === 'development';

config({
  path: join(process.cwd(), global.dev ? '.dev.env' : '.env')
});

global.env = envSchema.parse(process.env);
