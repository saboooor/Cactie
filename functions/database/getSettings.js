module.exports = client => {
	client.getSettings = async function get(args) {
		let settings = await client.query(`SELECT * FROM settings WHERE guildId = ${args}`);
		if(!settings[0]) {
			client.setSettings(args);
			settings = await client.query(`SELECT * FROM settings WHERE guildId = ${args}`);
		}
		delete settings[0].guildId;
		return settings[0];
	};
};