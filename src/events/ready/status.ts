import { schedule } from 'node-cron';
import { ActivityType, Client } from 'discord.js';

export default async (client: Client<true>) => schedule('*/10 * * * * *', async () => {
  const activities = [
    ['Playing', 'with you ;)'],
    ['Playing', '/help'],
    ['Playing', 'netherdepths.com'],
    ['Watching', 'myself grow'],
    ['Watching', 'luminescent.dev'],
    ['Watching', 'cactie.luminescent.dev'],
    ['Competing', `Getting more than ${client.guilds.cache.size} servers!`],
    ['Competing', `${client.guilds.cache.size} servers!`],
  ];
  const i = Math.floor(Math.random() * activities.length);
  const activity = activities[i];
  client.user.setPresence({ activities: [{ name: activity[1], type: ActivityType[activity[0] as Exclude<keyof typeof ActivityType, 'Custom'>] }], status: 'dnd' });
});