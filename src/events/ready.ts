import { event, Events } from '@/lib/events';

export const once = true;

export default event(Events.ClientReady, () => {
  console.log(`Logged in as ${global.client.user!.tag}`);
});
