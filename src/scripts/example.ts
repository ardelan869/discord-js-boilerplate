import { Events } from 'discord.js';

export const events = [Events.GuildMemberUpdate];

export const interval = 10000;

export default async function example() {
  console.log('I get executed on `guildMemberUpdate`, or every 10 seconds');
}
