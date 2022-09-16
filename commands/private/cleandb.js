module.exports = {
	name: 'cleandb',
	description: 'cleans the db of guilds that no longer exist',
	async execute(message, args, client) {
		// Check if user is sab lolololol
		const settings = await client.query('SELECT * FROM settings');
		for (const srvconfig of settings) {
			const guild = await client.guilds.fetch(srvconfig.guildId).catch(() => { return null; });
			if (!guild) {
				client.delData('settings', 'guildId', srvconfig.guildId);
				client.delData('reactionroles', 'guildId', srvconfig.guildId);
				client.delData('ticketdata', 'guildId', srvconfig.guildId);
				logger.info(`${client.user.username} has been removed from ${srvconfig.guildId}`);
			}
		}
		message.reply('Deleted all redundant data!');
	},
};