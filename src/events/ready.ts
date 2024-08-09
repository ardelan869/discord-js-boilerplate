import { event, Events } from '@/lib/events';

export default event(Events.ClientReady, () => {
  console.log(`Logged in as ${global.client.user!.tag}`);
});
