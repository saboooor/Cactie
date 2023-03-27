import * as mariadb from 'mariadb';

import { readFileSync } from 'fs';
import YAML from 'yaml';
const { mysql } = YAML.parse(readFileSync('./config.yml', 'utf8'));

import { Table } from 'types/mysql';

// Create connection
let con: mariadb.Connection | null = null; 

function createConnection(args: any, retry: number = 0) {
	mariadb.createConnection(mysql).then((connection: mariadb.Connection) => {
		logger.info('Connected to MySQL database'); con = connection;
	}).catch(async (err: mariadb.SqlError) => {
		logger.error('Error connecting to MySQL database: ' + err);
		if (retry > 5) return logger.error('Failed to connect to MySQL database after 5 retries');
		logger.info('Retrying connection to MySQL database in 3 seconds');
		await sleep(3000);
		createConnection(args, retry + 1);
	});
}

// Create connection
createConnection(mysql);

// Query function
export async function query(args: string) {
	if (!args.startsWith('SELECT *')) logger.info('Query: ' + args);
	if (!con) throw Error('No connection to database');
	return await con.query(args);
};

export async function createData(table: Table, body: any) {
	const bodykeys = Object.keys(body);
	const bodyvalues = Object.values(body);
	const VALUES = bodyvalues.map(v => { return v === null ? 'NULL' : `'${v}'`; }).join(', ');
	try {
		await query(`INSERT INTO ${table} (${bodykeys.join(', ')}) VALUES (${VALUES})`);
		logger.info(`Created ${table}: ${JSON.stringify(body)}`);
	}
	catch (err) {
		logger.error(`Error creating ${table}: ${err}`);
	}
};

export async function delData(table: Table, where: any) {
	const wherekeys = Object.keys(where);
	const WHERE = wherekeys.map(k => { return `${k} = ${where[k] === null ? 'NULL' : `'${where[k]}'`}`; }).join(' AND ');
	try {
		await query(`DELETE FROM ${table} WHERE ${WHERE}`);
		logger.info(`${table} deleted where ${JSON.stringify(where)}!`);
	}
	catch (err) {
		logger.error(`Error deleting ${table} where ${JSON.stringify(where)}: ${err}`);
	}
};


export async function getData(table: Table, where: any, options?: { nocreate?: boolean, all?: boolean }) {
	const wherekeys = where ? Object.keys(where) : null;
	const WHERE = wherekeys ? wherekeys.map(k => { return `${k} = ${where[k] === null ? 'NULL' : `'${where[k]}'`}`; }).join(' AND ') : null;
	let data = await query(`SELECT * FROM ${table}${WHERE ? ` WHERE ${WHERE}` : ''}`);
	if (where && !options?.nocreate && !data[0]) {
		await createData(table, where);
		data = await getData(table, where, { nocreate: true, all: true });
	}
	return options?.all ? data : data[0];
};

export async function setData(table: Table, where: any, body: any) {
	const wherekeys = Object.keys(where);
	const WHERE = wherekeys.map(k => { return `${k} = ${where[k] === null ? 'NULL' : `'${where[k]}'`}`; }).join(' AND ');
	const bodykeys = Object.keys(body);
	const SET = bodykeys.map(k => { return `${k} = ${body[k] === null ? 'NULL' : `'${body[k]}'`}`; }).join(', ');
	const data = await query(`SELECT * FROM ${table} WHERE ${WHERE}`);
	logger.info(`Set ${table} where ${JSON.stringify(where)} to ${JSON.stringify(body)}`);
	if (!data[0]) await createData(table, where);
	query(`UPDATE ${table} SET ${SET} WHERE ${WHERE}`);
};