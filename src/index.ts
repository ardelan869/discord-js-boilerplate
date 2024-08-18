import '@/env';
import { Client, Collection } from 'discord.js';

import { register as registerButtons, type Button } from '@/lib/buttons';
import { register as registerCommands, type Command } from '@/lib/commands';
import { register as registerEvents } from '@/lib/events';
import type { ModalResolver } from '@/lib/modals';
import {
  register as registerSelections,
  type Selection,
} from '@/lib/selections';
import { existsSync } from 'fs';

interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
  buttons: Collection<string, Button>;
  modals: Collection<string, ModalResolver>;
  selections: Collection<string, Selection>;
}

const client = new Client({
  intents: [],
}) as ExtendedClient;

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selections = new Collection();

global.client = client;

async function main() {
  if (existsSync('../config.json'))
    global.config = await import('../config.json');
  else global.config = null;

  await registerEvents();
  await registerCommands();
  await registerButtons();
  await registerSelections();

  try {
    await client.login(global.env.CLIENT_TOKEN);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

export { client, client as default, type ExtendedClient };
