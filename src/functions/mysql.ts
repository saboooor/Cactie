import * as mariadb from 'mariadb';

import { readFileSync } from 'fs';
import YAML from 'yaml';
const { mysql } = YAML.parse(readFileSync('./config.yml', 'utf8'));

// Create connection
const con = await mariadb.createConnection(mysql);

// Query function
export function query(args: string) {
	if (!args.startsWith('SELECT *')) logger.info('Query: ' + args);
	return new Promise((resolve, reject) => {
		con.query(args, (err: mariadb.SqlError, rows: any[][], fields: mariadb.FieldInfo[]) => {
			if (err) reject(err);
			console.log({ rows, fields });
			resolve({ rows, fields });
		});
	});
};

export async function createData(table: string, body: any) {
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

export async function delData(table: string, where: any) {
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


export async function getData(table: string, where: any, options = { nocreate: false, all: false }) {
	const wherekeys = where ? Object.keys(where) : null;
	const WHERE = wherekeys ? wherekeys.map(k => { return `${k} = ${where[k] === null ? 'NULL' : `'${where[k]}'`}`; }).join(' AND ') : null;
	let data = await query(`SELECT * FROM ${table}${WHERE ? ` WHERE ${WHERE}` : ''}`);
	// @ts-ignore
	if (where && !options.nocreate && !data[0]) {
		await createData(table, where);
		data = await getData(table, where, { nocreate: true, all: true });
	}
	// @ts-ignore
	return options.all ? data : data[0];
};

export async function setData(table: string, where: any, body: any) {
	const wherekeys = Object.keys(where);
	const WHERE = wherekeys.map(k => { return `${k} = ${where[k] === null ? 'NULL' : `'${where[k]}'`}`; }).join(' AND ');
	const bodykeys = Object.keys(body);
	const SET = bodykeys.map(k => { return `${k} = ${body[k] === null ? 'NULL' : `'${body[k]}'`}`; }).join(', ');
	const data = await query(`SELECT * FROM ${table} WHERE ${WHERE}`);
	logger.info(`Set ${table} where ${JSON.stringify(where)} to ${JSON.stringify(body)}`);
	// @ts-ignore
	if (!data[0]) await createData(table, where);
	query(`UPDATE ${table} SET ${SET} WHERE ${WHERE}`);
};

logger.info('MySQL database loaded');