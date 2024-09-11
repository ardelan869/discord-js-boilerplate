/* eslint-disable no-var */
import { z } from 'zod';
import { envSchema } from './env';

declare global {
  var client: import('@/index').ExtendedClient;
  var env: z.infer<typeof envSchema>;
  var dev: boolean;
  var config: typeof import('../config.json');
}

export {};
