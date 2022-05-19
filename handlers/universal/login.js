const fs = require('fs');
const YAML = require('yaml');
const { con } = YAML.parse(fs.readFileSync('./config.yml', 'utf8'));
module.exports = client => {
	client.login(con.discord.token);
	client.logger.info('Bot logged in');
};