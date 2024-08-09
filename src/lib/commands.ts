import { join } from 'path';
import { readdirSync } from 'fs';

import {
  REST,
  Routes,
  type SlashCommandBuilder,
  type CommandInteraction,
  type Awaitable,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

const COMMANDS_PATH = join(
  process.cwd(),
  global.dev ? 'src' : 'dist',
  'commands'
);

type CommandCallback = (interaction: CommandInteraction) => Awaitable<unknown>;

interface Command {
  data: SlashCommandBuilder;
  callback: CommandCallback;
}

function command(
  data: SlashCommandBuilder,
  callback: CommandCallback
): Command {
  return { data, callback };
}

async function register() {
  const files = readdirSync(COMMANDS_PATH).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  const deploys: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  for (const fileName of files) {
    const file = await import(join('file://', COMMANDS_PATH, fileName));
    const command = file.default;
    const isDev = fileName.includes('.dev.');

    if (!command || !('data' in command) || !('callback' in command)) continue;

    if (!isDev || global.dev) {
      deploys.push(command.data.toJSON());
      global.client.commands.set(command.data.name, command);
    }
  }

  const rest = new REST({ version: '10' }).setToken(global.env.CLIENT_TOKEN!);

  env.GUILD_IDS.forEach((id) => {
    rest.put(Routes.applicationGuildCommands(global.env.CLIENT_ID!, id), {
      body: deploys,
    });
  });
}

export { command, register, type Command, type CommandCallback };
