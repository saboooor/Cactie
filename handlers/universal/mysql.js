const mariadb = require('mariadb/callback');
const { readdirSync } = require('fs');
const { host, user, pass, db } = require('../config/mysql.json');
module.exports = async client => {
	// Database Functions
	let amount = 0;
	readdirSync('./functions/database/').forEach(file => {
		require(`../../functions/database/${file}`)(client);
		amount = amount + 1;
	});
	client.logger.info(`${amount} database functions loaded `);

	// Create a connection to the database
	client.con = mariadb.createConnection({
		host: host,
		user: user,
		password: pass,
		database: db,
	});

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