import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

import {
  REST,
  Routes,
  type Awaitable,
  type ChatInputCommandInteraction,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder
} from 'discord.js';
import { pathToFileURL } from 'url';

const COMMANDS_PATH = join(
  process.cwd(),
  global.dev ? 'src' : 'dist',
  'commands'
);

type CommandCallback = (
  interaction: ChatInputCommandInteraction
) => Awaitable<unknown>;

interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  callback: CommandCallback;
}

function command(
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
  callback: CommandCallback
): Command {
  return { data, callback };
}

async function register() {
  if (!existsSync(COMMANDS_PATH)) return;

  const files = readdirSync(COMMANDS_PATH).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  const deploys: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  for (const fileName of files) {
    const filePath = pathToFileURL(join(COMMANDS_PATH, fileName));
    const file = await import(filePath.href);
    const command = file.default;
    const isDev = fileName.includes('.dev.');

    if (!command || !('data' in command) || !('callback' in command)) continue;

    if (!isDev || global.dev) {
      deploys.push(command.data.toJSON());
      global.client.commands.set(command.data.name, command);
    }
  }

  const rest = new REST({ version: '10' }).setToken(global.env.CLIENT_TOKEN);

  env.GUILD_IDS.forEach((id) => {
    rest.put(Routes.applicationGuildCommands(global.env.CLIENT_ID!, id), {
      body: deploys
    });
  });
}

export { command, register, type Command, type CommandCallback };
