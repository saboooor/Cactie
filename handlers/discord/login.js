const { discordtoken } = require('../../config/bot.json');
module.exports = client => {
	client.login(discordtoken);
	client.logger.info('Bot logged in');
};