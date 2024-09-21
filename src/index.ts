import '@/env';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

import { existsSync } from 'fs';

import type { ModalResolver } from '@/lib/modals';
import { register as registerEvents } from '@/lib/events';
import { register as registerCommands, type Command } from '@/lib/commands';
import { register as registerButtons, type Button } from '@/lib/buttons';
import {
  register as registerSelections,
  type Selection
} from '@/lib/selections';
import { register as registerScripts } from '@/lib/scripts';

interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
  buttons: Collection<string, Button>;
  modals: Collection<string, ModalResolver>;
  selections: Collection<string, Selection>;
}

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers // Needed for 'guildMemberUpdate' event
  ]
}) as ExtendedClient;

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selections = new Collection();

global.client = client;

async function main() {
  if (existsSync('./config.json') || existsSync('../config.json')) {
    const file = await import('../config.json', {
      assert: {
        type: 'json'
      }
    });

    global.config = 'default' in file ? file.default : file;
  }

  await registerEvents();
  await registerCommands();
  await registerButtons();
  await registerSelections();
  await registerScripts();

  try {
    await client.login(global.env.CLIENT_TOKEN);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

export { client as default, client, type ExtendedClient };
