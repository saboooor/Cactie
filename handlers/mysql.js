const mariadb = require('mariadb/callback');
const { readFileSync } = require('fs');
const YAML = require('yaml');
const { mysql } = YAML.parse(readFileSync('./config.yml', 'utf8'));

module.exports = async client => {
	// Create a connection to the database
	client.con = mariadb.createConnection(mysql);

	// Query function
	client.query = function query(args) {
		if (!args.startsWith('SELECT *')) logger.info('Query: ' + args);
		return new Promise((resolve, reject) => {
			client.con.query(args, (err, rows, fields) => {
				if (err) reject(err);
				resolve(rows, fields);
			}).on('error', err => reject(`Error: ${err.message}`));
		});
	};

	// createData function
	client.createData = async function createData(table, body) {
		const bodykeys = Object.keys(body);
		const bodyvalues = Object.values(body);
		const VALUES = bodyvalues.map(v => { return v === null ? 'NULL' : `'${v}'`; }).join('\', \'');
		try {
			await client.query(`INSERT INTO ${table} (${bodykeys.join(', ')}) VALUES (${VALUES})`);
			logger.info(`Created ${table}: ${JSON.stringify(body)}`);
		}
		catch (err) {
			client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: `<@&839158574138523689> ${err}` });
			logger.error(`Error creating ${table}: ${err}`);
		}
	};

	// delData function
	client.delData = async function delData(table, where) {
		const wherekeys = Object.keys(where);
		const WHERE = wherekeys.map(k => { return `${k} = ${where[k] === null ? 'NULL' : `'${where[k]}'`}`; }).join(' AND ');
		try {
			await client.query(`DELETE FROM ${table} WHERE ${WHERE}`);
			logger.info(`${table} deleted where ${JSON.stringify(where)}!`);
		}
		catch (err) {
			client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: `<@&839158574138523689> ${err}` });
			logger.error(`Error deleting ${table} where ${JSON.stringify(where)}: ${err}`);
		}
	};

	// getData function
	client.getData = async function getData(table, where) {
		const wherekeys = Object.keys(where);
		const WHERE = wherekeys.map(k => { return `${k} = ${where[k] === null ? 'NULL' : `'${where[k]}'`}`; }).join(' AND ');
		let data = await client.query(`SELECT * FROM ${table} WHERE ${WHERE}`);
		if (!data[0]) {
			await client.createData(table, where);
			data = [await getData(table, where)];
		}
		return data[0];
	};

	// setData function
	client.setData = async function setData(table, where, body) {
		const wherekeys = Object.keys(where);
		const WHERE = wherekeys.map(k => { return `${k} = ${where[k] === null ? 'NULL' : `'${where[k]}'`}`; }).join(' AND ');
		const bodykeys = Object.keys(body);
		const SET = bodykeys.map(k => { return `${k} = ${body[k] === null ? 'NULL' : `'${body[k]}'`}`; }).join(', ');
		const data = await client.query(`SELECT * FROM ${table} WHERE ${WHERE}`);
		logger.info(`Set ${table} where ${JSON.stringify(where)} to ${JSON.stringify(body)}`);
		if (!data[0]) await client.createData(table, { where });
		client.query(`UPDATE ${table} SET ${SET} WHERE ${WHERE}`);
	};

	// Log
	logger.info('MySQL database loaded');
};