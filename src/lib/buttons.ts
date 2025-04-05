import type { Awaitable, ButtonInteraction } from 'discord.js';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';

const BUTTONS_PATH = join(
  process.cwd(),
  global.dev ? 'src' : 'dist',
  'buttons'
);

type ButtonCallback = (interaction: ButtonInteraction) => Awaitable<unknown>;

interface Button {
  id: string;
  callback: ButtonCallback;
}

function callback(id: string, callback: ButtonCallback): Button {
  return { id, callback };
}

async function register() {
  if (!existsSync(BUTTONS_PATH)) return;

  const files = readdirSync(BUTTONS_PATH).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  for (const fileName of files) {
    const filePath = pathToFileURL(join(BUTTONS_PATH, fileName));
    const file = await import(filePath.href);
    const button = file.default;
    const isDev = fileName.includes('.dev.');

    if (!button || !('id' in button) || !('callback' in button)) continue;

    if (!isDev || global.dev) global.client.buttons.set(button.id, button);
  }
}

export { callback, register, type Button };
