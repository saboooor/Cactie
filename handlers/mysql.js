const mysql = require('mysql');
const { readdirSync } = require('fs');
const { host, user, pass, db } = require('../config/mysql.json');

module.exports = async client => {

	// Database Functions
	readdirSync('./functions/database/').forEach(file => {
		require(`../functions/database/${file}`)(client);
		const eventName = file.split('.')[0];
		client.logger.info(`Loading Database function ${eventName}`);
	});

	// create a connection to the database
	client.con = mysql.createConnection({
		host: host,
		user: user,
		password: pass,
		database: db,
	});

	client.con.connect(async err => {
		if (err) throw err;
		client.logger.info('Connected to database succesfully');
	});

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

};