/* eslint-disable no-var */
import type { z } from 'zod';
import type { envSchema } from './env';

declare global {
  var client: import('@/index').ExtendedClient;
  var env: z.infer<typeof envSchema>;
  var dev: boolean;
  var config: typeof import('../config.json');
}
