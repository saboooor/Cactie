import { schedule } from 'node-cron';
import { ActivityType, Client } from 'discord.js';
import ms from 'ms';

// @ts-ignore
import packageJSON from '../../../package.json' assert { type: 'json' };

export default async (client: Client<true>) => {
  client.user.setPresence({ activities: [{ name: 'Just Restarted!', type: ActivityType.Playing }], status: 'dnd' });
  client.user.setStatus('dnd');
  schedule('*/10 * * * * *', async () => {
    const activities = [
      ['Playing', 'with you ;)'],
      ['Playing', 'in the sand'],
      ['Watching', 'myself grow'],
      ['Watching', 'out the window'],
      ['Watching', `${client.guilds.cache.size} servers`],
      ['Custom', '/help for help'],
      ['Custom', 'luminescent.dev'],
      ['Custom', 'Also check out Lumin!'],
      ['Custom', 'cactie.luminescent.dev'],
      ['Custom', `Version: ${packageJSON.version}`],
      ['Custom', `Uptime: ${ms(Date.now() - Number(rn), { long: true })}`],
      ['Custom', `I'm in ${client.guilds.cache.size} servers!`],
    ];
    const i = Math.floor(Math.random() * activities.length);
    const activity = activities[i];
    client.user.setPresence({ activities: [{ name: activity[1], type: ActivityType[activity[0] as keyof typeof ActivityType] }], status: 'dnd' });
  });
};