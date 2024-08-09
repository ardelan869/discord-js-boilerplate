import { callback } from '@/lib/buttons';

export default callback('example-button', async (interaction) => {
  await interaction.reply('example button was pressed');
});
