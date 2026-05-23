import { schedule } from 'node-cron';
import { ActivityType, Client } from 'discord.js';
import ms from 'ms';

import packageJSON from '../../../package.json' with { type: 'json' };
import { lastStarted } from '~/index';

export default async (client: Client<true>) => {
  client.user.setPresence({ activities: [{ name: 'Just Restarted!', type: ActivityType.Playing }], status: 'dnd' });
  client.user.setStatus('dnd');
  schedule('*/10 * * * * *', async () => {
    const activities = [
      '/help for help',
      'luminescent.dev',
      'Also check out Lumin!',
      'sova.fyi',
      `Version: ${packageJSON.version}`,
      `Uptime: ${ms(Date.now() - Number(lastStarted), { long: true })}`,
      `I'm in ${client.guilds.cache.size} servers!`,
    ];
    const i = Math.floor(Math.random() * activities.length);
    const activity = activities[i]!;
    client.user.setPresence({ activities: [{ name: activity, type: ActivityType.Custom }], status: 'idle' });
  });
};