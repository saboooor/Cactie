const mariadb = require('mariadb/callback');
const fs = require('fs');
const YAML = require('yaml');
const { mysql } = YAML.parse(fs.readFileSync('./config.yml', 'utf8'));
module.exports = async client => {
	// Database Functions
	const databaseFunctions = fs.readdirSync('./functions/database/').filter(file => file.endsWith('.js'));
	for (const file of databaseFunctions) require(`../functions/database/${file}`)(client);
	client.logger.info(`${databaseFunctions.length} database functions loaded `);

	// Create a connection to the database
	client.con = mariadb.createConnection(mysql);

	// Query function
	client.query = function query(args) {
		if (!args.startsWith('SELECT *')) client.logger.info('Query: ' + args);
		return new Promise((resolve, reject) => {
			client.con.query(args, (err, rows, fields) => {
				if (err) reject(err);
				resolve(rows, fields);
			}).on('error', err => reject(`Error: ${err.message}`));
		});
	};
	client.logger.info('MySQL database loaded');
};