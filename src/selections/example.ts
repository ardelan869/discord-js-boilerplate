import { callback } from '@/lib/selections';

export default callback('example-selection', async (interaction) => {
  await interaction.reply('example selection was pressed');
});
