import { event, Events } from '@/lib/events';
import { Interaction } from 'discord.js';

type InteractionHandler<T extends Interaction> = (
  interaction: T
) => Promise<void>;

async function handleInteraction<T extends Interaction>(
  interaction: T,
  type: string,
  collection: 'commands' | 'buttons' | 'modals' | 'selections'
): Promise<void> {
  const key =
    'customId' in interaction
      ? interaction.customId
      : 'commandName' in interaction
        ? interaction.commandName
        : null;

  if (key === null) return console.warn(`Unable to find key for ${type}`);

  const item = global.client[collection].get(key);

  if (!item) return console.warn(`No ${type} matching ${key} was found.`);

  try {
    if (typeof item === 'function') item(interaction as never);
    else if ('callback' in item && typeof item.callback === 'function')
      await (item.callback as (interaction: Interaction) => Promise<void>)(
        interaction
      );
    else throw new Error(`Invalid ${type} structure`);
  } catch (error) {
    console.error(`Error in ${type}:`, error);

    if ('reply' in interaction && typeof interaction.reply === 'function')
      await interaction
        .reply({
          content: `An error occurred while executing this ${type}.`,
          ephemeral: true
        })
        .catch(console.error);
  }
}

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
    handleInteraction(interaction, 'selection', 'selections')
};

export default event(
  Events.InteractionCreate,
  async (interaction: Interaction) => {
    const handler =
      interactionHandlers[
        interaction.constructor.name as keyof typeof interactionHandlers
      ];

    if (handler) return await handler(interaction as never);

    console.warn(
      `No interaction handler for type ${interaction.constructor.name} was found.`
    );
  }
);
