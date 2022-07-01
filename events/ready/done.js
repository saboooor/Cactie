const { ActivityType } = require('discord.js');
module.exports = async (client) => {
	client.user.setPresence({ activities: [{ name: 'Just Restarted!', type: ActivityType.Game }], status: 'dnd' });
	client.user.setStatus('dnd');
	client.manager.init(client.user.id);
	const timer = (Date.now() - client.startTimestamp) / 1000;
	client.logger.info(`Done (${timer}s)! I am running!`);
};