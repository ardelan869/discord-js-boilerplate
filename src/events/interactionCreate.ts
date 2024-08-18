import { event, Events } from '@/lib/events';
import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Interaction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from 'discord.js';

interface ExtendedClient {
  commands: Map<
    string,
    { callback: (interaction: ChatInputCommandInteraction) => Promise<void> }
  >;
  buttons: Map<
    string,
    { callback: (interaction: ButtonInteraction) => Promise<void> }
  >;
  modals: Map<string, (interaction: ModalSubmitInteraction) => Promise<void>>;
  selections: Map<
    string,
    { callback: (interaction: StringSelectMenuInteraction) => Promise<void> }
  >;
}

type InteractionHandler<T extends Interaction> = (
  interaction: T
) => Promise<void>;

const handleInteraction = async <T extends Interaction>(
  interaction: T,
  type: string,
  collection: keyof ExtendedClient
): Promise<void> => {
  const key =
    'customId' in interaction
      ? interaction.customId
      : 'commandName' in interaction
        ? interaction.commandName
        : null;

  if (key === null) {
    console.warn(`Unable to find key for ${type}`);
    return;
  }

  const item = global.client[collection].get(key);
  if (!item) {
    console.warn(`No ${type} matching ${key} was found.`);
    return;
  }

  try {
    if (typeof item === 'function') {
      (item as (interaction: Interaction) => void)(interaction);
    } else if ('callback' in item && typeof item.callback === 'function') {
      await (item.callback as (interaction: Interaction) => Promise<void>)(
        interaction
      );
    } else {
      throw new Error(`Invalid ${type} structure`);
    }
  } catch (error) {
    console.error(`Error in ${type}:`, error);
    if ('reply' in interaction && typeof interaction.reply === 'function') {
      await interaction
        .reply({
          content: `An error occurred while executing this ${type}.`,
          ephemeral: true,
        })
        .catch(console.error);
    }
  }
};

const interactionHandlers: {
  [K in Interaction['constructor']['name']]?: InteractionHandler<
    Extract<Interaction, { constructor: { name: K } }>
  >;
} = {
  ChatInputCommandInteraction: (interaction) =>
    handleInteraction(interaction, 'command', 'commands'),
  ButtonInteraction: (interaction) =>
    handleInteraction(interaction, 'button', 'buttons'),
  ModalSubmitInteraction: (interaction) =>
    handleInteraction(interaction, 'modal', 'modals'),
  StringSelectMenuInteraction: (interaction) =>
    handleInteraction(interaction, 'selection', 'selections'),
};

export default event(
  Events.InteractionCreate,
  async (interaction: Interaction) => {
    const handler =
      interactionHandlers[
        interaction.constructor.name as keyof typeof interactionHandlers
      ];
    if (handler) {
      await handler(interaction as never);
    } else {
      console.warn(
        `No interaction handler for type ${interaction.constructor.name} was found.`
      );
    }
  }
);
