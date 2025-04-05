import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';

const SCRIPTS_PATH = join(
  process.cwd(),
  global.dev ? 'src' : 'dist',
  'scripts'
);

async function register() {
  if (!existsSync(SCRIPTS_PATH)) return;

  const files = readdirSync(SCRIPTS_PATH).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  for (const fileName of files) {
    const filePath = pathToFileURL(join(SCRIPTS_PATH, fileName));
    const file = await import(filePath.href);
    const script = file.default;
    const isDev = fileName.includes('.dev.');
    const interval = file.interval;
    const events = file.events;

    if (!script || typeof script !== 'function') continue;

    if (isDev && !global.dev) continue;

    await script();

    if (typeof interval === 'number' && interval > 0)
      setInterval(script, interval);

    if (!Array.isArray(events)) continue;

    for (const event of events)
      global.client.on(event, async () => await script());
  }
}

export { register };
