import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

import { type ClientEvents, type Awaitable, Events } from 'discord.js';
import { pathToFileURL } from 'url';

const EVENTS_PATH = join(process.cwd(), global.dev ? 'src' : 'dist', 'events');

type EventKeys = keyof ClientEvents;

type EventCallback<T extends EventKeys> = (
  ...args: ClientEvents[T]
) => Awaitable<unknown>;

interface Event<T extends EventKeys = EventKeys> {
  key: T;
  callback: EventCallback<T>;
}

function event<T extends EventKeys>(
  key: T,
  callback: EventCallback<T>
): Event<T> {
  return { key, callback };
}

async function register() {
  if (!existsSync(EVENTS_PATH)) return;

  const files = readdirSync(EVENTS_PATH).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  for (const fileName of files) {
    const filePath = pathToFileURL(join(EVENTS_PATH, fileName));
    const file = await import(filePath.href);
    const event = file.default;
    const isDev = fileName.includes('.dev.');

    if (!event || !('key' in event) || !('callback' in event)) continue;

    const once = file.once ?? false;

    if (!isDev || global.dev)
      global.client[once ? 'once' : 'on'](
        event.key,
        async (...args: ClientEvents[keyof ClientEvents]) => {
          await event.callback(...args);
        }
      );
  }
}

export {
  event,
  register,
  Events,
  type Event,
  type EventKeys,
  type EventCallback
};
