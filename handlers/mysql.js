const mariadb = require('mariadb/callback');
const fs = require('fs');
const YAML = require('yaml');
const { mysql } = YAML.parse(fs.readFileSync('./config.yml', 'utf8'));
module.exports = async client => {
	// Database Functions
	let amount = 0;
	fs.readdirSync('./functions/database/').forEach(file => {
		require(`../functions/database/${file}`)(client);
		amount = amount + 1;
	});
	client.logger.info(`${amount} database functions loaded `);

	// Create a connection to the database
	client.con = mariadb.createConnection(mysql);

	// Query function
	client.query = function query(args) {
		if (!args.startsWith('SELECT *')) client.logger.info('Query: ' + args);
		return new Promise((resolve, reject) => {
			client.con.query(args, (err, rows, fields) =>{
				if(err) return err;
				resolve(rows, fields);
			}).on('error', err => {
				reject(`Error: ${err.message}`);
			});
		});
	};
	client.logger.info('MySQL database loaded');
};