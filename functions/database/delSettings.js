module.exports = client => {
	client.delSettings = function delSettings(args) {
		try {
			client.con.query(`DELETE FROM settings WHERE guildId = ${args}`);
			client.logger.info(`Settings deleted for ${client.guilds.cache.get(args).name}!`);
		}
		catch (error) {
			client.users.cache.get('249638347306303499').send(`${error}`);
			client.logger.error(`Error deleting guild settings: ${error}`);
		}
	};
};