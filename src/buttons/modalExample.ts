import { callback } from '@/lib/buttons';
import { awaitModal } from '@/lib/modals';
import { ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { ActionRowBuilder, TextInputStyle } from 'discord.js';

export default callback('modal-example', async (interaction) => {
  const textInput = new TextInputBuilder()
    .setCustomId('example-text-input')
    .setLabel('Example Text Input')
    .setStyle(TextInputStyle.Short);

  const row = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput);

  const modal = new ModalBuilder()
    .setCustomId('example-modal')
    .setTitle('Example Modal')
    .addComponents(row);

  await interaction.showModal(modal);

  const modalInteraction = await awaitModal('example-modal');

  await modalInteraction.reply(
    `Modal submited: ${modalInteraction.fields.getTextInputValue('example-text-input')}`
  );
});
