import { ActivityType, Client } from 'discord.js';

export default async (client: Client) => {
	client.user?.setPresence({ activities: [{ name: 'Just Restarted!', type: ActivityType.Playing }], status: 'dnd' });
	client.user?.setStatus('dnd');
};