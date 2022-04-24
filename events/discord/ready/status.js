const { schedule } = require('node-cron');
const { ActivityType } = require('discord.js');
module.exports = async (client) => {
	schedule('*/10 * * * * *', async () => {
		const activities = [
			['Game', 'with you ;)'],
			['Game', '/help'],
			['Watching', 'cactie.smhsmh.club'],
			['Competing', `Getting more than ${client.guilds.cache.size} servers!`],
			['Competing', `${client.guilds.cache.size} servers!`],
			['Listening', '3 Big Balls'],
			['Listening', 'Never Gonna Give You Up'],
			['Listening', 'Fortnite Battle Pass'],
		];
		const i = Math.floor(Math.random() * activities.length);
		const activity = activities[i];
		client.user.setPresence({ activities: [{ name: activity[1], type: ActivityType[activity[0]] }] });
	});
};