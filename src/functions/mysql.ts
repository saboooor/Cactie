import * as mariadb from 'mariadb';

import { readFileSync } from 'fs';
import * as YAML from 'yaml';
const { mysql } = YAML.parse(readFileSync('./config.yml', 'utf8'));

import { ticketData, settings, reactionRoles, memberData, lastVoted, Table } from '~/types/mysql';

// Create connection
let con: mariadb.Connection | null = null;

function createConnection(retry: number = 0) {
  mariadb.createConnection(mysql).then((connection: mariadb.Connection) => {
    logger.info('Connected to MySQL database'); con = connection;
  }).catch(async (err: mariadb.SqlError) => {
    logger.error('Error connecting to MySQL database: ' + err);
    if (retry > 5) return logger.error('Failed to connect to MySQL database after 5 retries');
    logger.info('Retrying connection to MySQL database in 3 seconds');
    await sleep(3000);
    createConnection(retry + 1);
  });
}

// Create connection
createConnection();

// Query function
export async function query(args: string) {
  if (!args.startsWith('SELECT *')) logger.info('Query: ' + args);
  if (!con) throw Error('No connection to database');
  return await con.query(args);
}

async function createData(table: Table, body: { [key: string]: string | null }) {
  const bodykeys = Object.keys(body);
  const bodyvalues = Object.values(body);
  const VALUES = bodyvalues.map(v => { return v === null ? 'NULL' : `'${v}'`; }).join(', ');
  try {
    logger.info(`Created ${table}: ${JSON.stringify(body)}`);
    return await query(`INSERT INTO ${table} (${bodykeys.join(', ')}) VALUES (${VALUES})`);
  }
  catch (err) {
    logger.error(`Error creating ${table}: ${err}`);
  }
}

async function delData(table: Table, where: { [key: string]: string | null }) {
  const wherekeys = Object.keys(where);
  const WHERE = wherekeys.map(k => { return `${k} = ${where[k] === null ? 'NULL' : `'${where[k]}'`}`; }).join(' AND ');
  try {
    await query(`DELETE FROM ${table} WHERE ${WHERE}`);
    logger.info(`${table} deleted where ${JSON.stringify(where)}!`);
  }
  catch (err) {
    logger.error(`Error deleting ${table} where ${JSON.stringify(where)}: ${err}`);
  }
}

async function getData(table: 'ticketdata', where: { [key: string]: string | null } | undefined, options: { nocreate?: boolean, all: true }): Promise<ticketData[]>;
async function getData(table: 'ticketdata', where: { [key: string]: string | null } | undefined, options?: { nocreate?: boolean, all?: false }): Promise<ticketData>;
async function getData(table: 'settings', where: { [key: string]: string | null } | undefined, options: { nocreate?: boolean, all: true }): Promise<settings[]>;
async function getData(table: 'settings', where: { [key: string]: string | null } | undefined, options?: { nocreate?: boolean, all?: false }): Promise<settings>;
async function getData(table: 'reactionroles', where: { [key: string]: string | null } | undefined, options: { nocreate?: boolean, all: true }): Promise<reactionRoles[]>;
async function getData(table: 'reactionroles', where: { [key: string]: string | null } | undefined, options?: { nocreate?: boolean, all?: false }): Promise<reactionRoles>;
async function getData(table: 'memberdata', where: { [key: string]: string | null } | undefined, options: { nocreate?: boolean, all: true }): Promise<memberData[]>;
async function getData(table: 'memberdata', where: { [key: string]: string | null } | undefined, options?: { nocreate?: boolean, all?: false }): Promise<memberData>;
async function getData(table: 'lastvoted', where: { [key: string]: string | null } | undefined, options: { nocreate?: boolean, all: true }): Promise<lastVoted[]>;
async function getData(table: 'lastvoted', where: { [key: string]: string | null } | undefined, options?: { nocreate?: boolean, all?: false }): Promise<lastVoted>;
async function getData(table: Table, where: { [key: string]: string | null } | undefined, options?: { nocreate?: boolean, all?: boolean }) {
  const wherekeys = where ? Object.keys(where) : null;
  const WHERE = wherekeys ? wherekeys.map(k => { return `${k} = ${where![k as keyof typeof where] === null ? 'NULL' : `'${where![k as keyof typeof where]}'`}`; }).join(' AND ') : null;
  let data = await query(`SELECT * FROM ${table}${WHERE ? ` WHERE ${WHERE}` : ''}`);

  if (where && !options?.nocreate && !data[0]) {
    data = await createData(table, where);
  }

  return options?.all
    ? data
    : data[0];
}

async function setData(table: Table, where: { [key: string]: string | null }, body: { [key: string]: string | null }) {
  const wherekeys = Object.keys(where);
  const WHERE = wherekeys.map(k => { return `${k} = ${where[k] === null ? 'NULL' : `'${where[k]}'`}`; }).join(' AND ');
  const bodykeys = Object.keys(body);
  const SET = bodykeys.map(k => { return `${k} = ${body[k] === null ? 'NULL' : `'${body[k]}'`}`; }).join(', ');
  const data = await query(`SELECT * FROM ${table} WHERE ${WHERE}`);
  logger.info(`Set ${table} where ${JSON.stringify(where)} to ${JSON.stringify(body)}`);
  if (!data[0]) await createData(table, where);
  query(`UPDATE ${table} SET ${SET} WHERE ${WHERE}`);
}

export { createData, delData, getData, setData };