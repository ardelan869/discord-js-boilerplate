import { event, Events } from '@/lib/events';

export default event(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = global.client.commands.get(interaction.commandName);

    if (!command)
      return console.warn(
        `No command matching ${interaction.commandName} was found.`
      );

    try {
      await command.callback(interaction);
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: 'An error occurred while executing this command.',
        ephemeral: true,
      });
    }
  } else if (interaction.isButton()) {
    const button = global.client.buttons.get(interaction.customId);

    if (!button)
      return console.warn(
        `No button matching ${interaction.customId} was found.`
      );

    try {
      await button.callback(interaction);
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: 'An error occurred while executing this button.',
        ephemeral: true,
      });
    }
  } else if (interaction.isModalSubmit()) {
    const modal = global.client.modals.get(interaction.customId);

    if (!modal)
      return console.warn(
        `No modal matching ${interaction.customId} was found.`
      );

    try {
      modal(interaction);
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: 'An error occurred while executing this modal.',
        ephemeral: true,
      });
    }
  } else if (interaction.isStringSelectMenu()) {
    const selection = global.client.selections.get(interaction.customId);

    if (!selection)
      return console.warn(
        `No selection matching ${interaction.customId} was found.`
      );

    try {
      selection.callback(interaction);
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: 'An error occurred while executing this selection.',
        ephemeral: true,
      });
    }
  } else {
    console.warn(`No interaction type matching ${interaction.type} was found.`);
  }
});
