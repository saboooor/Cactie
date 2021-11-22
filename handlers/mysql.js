const mariadb = require('mariadb/callback');
const { readdirSync } = require('fs');
const { host, user, pass, db } = require('../config/mysql.json');
module.exports = async client => {
	// Database Functions
	readdirSync('./functions/database/').forEach(file => {
		require(`../functions/database/${file}`)(client);
		const eventName = file.split('.')[0];
		client.logger.info(`Loading Database function ${eventName}`);
	});

	// Create a connection to the database
	client.con = mariadb.createConnection({
		host: host,
		user: user,
		password: pass,
		database: db,
	});

	// Query function
	client.query = function query(args) {
		return new Promise((resolve, reject) => {
			client.con.query(args, (err, rows, fields) =>{
				if(err) return err;
				resolve(rows, fields);
			}).on('error', err => {
				reject(`Error: ${err.message}`);
			});
		});
	};

	Array.from(client.settings).forEach(async guildData => {
		const guildId = guildData[0];
		const settings = await client.query(`SELECT * FROM settings WHERE guildId = ${guildId}`);
		if(!settings[0]) {
			client.logger.info(`Generated settings for ${client.guilds.cache.get(guildId).name}!`);
			client.setSettings(guildId);
		}
		Object.keys(guildData[1]).forEach(key => {
			client.query(`UPDATE settings Set ${key} = "${guildData[1][key]}" where guildId = "${guildId}"`);
		});
	});
};