import { schedule } from 'node-cron';
import { ActivityType, Client } from 'discord.js';

export default async (client: Client) => schedule('*/10 * * * * *', async () => {
  const activities = [
    ['Playing', 'with you ;)'],
    ['Playing', '/help'],
    ['Watching', 'luminescent.dev'],
    ['Watching', `${client.user!.username.toLowerCase().replace(/ /g, '')}.luminescent.dev`],
    ['Competing', `Getting more than ${client.guilds.cache.size} servers!`],
    ['Competing', `${client.guilds.cache.size} servers!`],
    ['Listening', '3 Big Balls'],
    ['Listening', 'Never Gonna Give You Up'],
    ['Listening', 'Fortnite Battle Pass'],
  ];
  const i = Math.floor(Math.random() * activities.length);
  const activity = activities[i];
	client.user!.setPresence({ activities: [{ name: activity[1], type: ActivityType[activity[0] as Exclude<keyof typeof ActivityType, 'Custom'>] }], status: 'dnd' });
});