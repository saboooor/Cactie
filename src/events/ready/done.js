const { ActivityType } = require('discord.js');

module.exports = async client => {
	client.user.setPresence({ activities: [{ name: 'Just Restarted!', type: ActivityType.Game }], status: 'dnd' });
	client.user.setStatus('dnd');
	const timer = (Date.now() - client.readyTimestamp) / 1000;
	logger.info(`Done (${timer}s)! I am running!`);
};