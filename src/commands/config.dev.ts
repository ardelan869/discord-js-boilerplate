import { command } from '@/lib/commands';
import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder
} from 'discord.js';

export default command(
  new SlashCommandBuilder()
    .setName('config')
    .setDescription('Guild Configuration Settings')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('view')
        .setDescription('View current guild configuration')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('edit')
        .setDescription('Edit guild configuration settings')
        .addChannelOption((option) =>
          option
            .setName('welcome_channel')
            .setDescription('Set the welcome channel')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
    ),
  async (interaction) => {
    const subcommand = interaction.options.getSubcommand();

    let server = await global.db.guildConfig.findUnique({
      where: { id: interaction.guildId ?? '' }
    });

    if (!server) {
      server = await global.db.guildConfig.create({
        data: { id: interaction.guildId ?? '' }
      });
    }

    switch (subcommand) {
      case 'view':
        await interaction.reply({
          content: `Configuration for this server:\n\n**Welcome Channel:** ${server.welcomeChannelId ? `<#${server.welcomeChannelId}>` : 'Not set'}`
        });
        break;
      case 'edit': {
        const welcomeChannel =
          interaction.options.getChannel('welcome_channel');

        if (welcomeChannel) {
          await global.db.guildConfig.update({
            where: { id: interaction.guildId ?? '' },
            data: { welcomeChannelId: welcomeChannel.id }
          });

          await interaction.reply({
            content: `✅ Configuration updated!\n\n**Welcome Channel:** <#${welcomeChannel.id}>`
          });
        }

        break;
      }
      default:
        await interaction.reply({
          content: 'Please specify at least one setting to update',
          ephemeral: true
        });
        break;
    }
  }
);
