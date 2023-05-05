import { Client } from 'discord.js';
import { readFileSync } from 'fs';
import YAML from 'yaml';
const { con } = YAML.parse(readFileSync('./config.yml', 'utf8'));

export default (client: Client) => {
  client.login(con.token);
  logger.info('Bot logged in');
};