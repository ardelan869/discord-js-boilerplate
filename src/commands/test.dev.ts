import { command } from '@/lib/commands';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  SlashCommandBuilder,
  StringSelectMenuBuilder
} from 'discord.js';

export default command(
  new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async (interaction) => {
    const exampleButton = new ButtonBuilder()
      .setCustomId('example-button')
      .setLabel('Example Button')
      .setStyle(ButtonStyle.Primary);

    const modalButton = new ButtonBuilder()
      .setCustomId('modal-example')
      .setLabel('Modal Example')
      .setStyle(ButtonStyle.Primary);

    const exampleSelection = new StringSelectMenuBuilder()
      .setCustomId('example-selection')
      .setPlaceholder('Select an option')
      .addOptions([
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ]);

    await interaction.reply({
      content: 'test',
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(exampleButton),
        new ActionRowBuilder<ButtonBuilder>().addComponents(modalButton),
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          exampleSelection
        )
      ]
    });
  }
);
