import { config } from 'dotenv';
import { join } from 'path';

global.dev = process.env.NODE_ENV === 'development';

config({
	path: join(process.cwd(), global.dev ? '.dev.env' : '.env'),
});

global.env = process.env;
