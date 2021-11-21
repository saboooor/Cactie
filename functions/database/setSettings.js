module.exports = client => {
	client.setSettings = function setSettings(args) {
		try {
			client.con.query('INSERT INTO settings (guildId) VALUES (?)', [args]);
		}
		catch (error) {
			client.users.cache.get('249638347306303499').send(`${error}`);
			client.logger.error(`Error creating guild settings: ${error}`);
		}
	};
};