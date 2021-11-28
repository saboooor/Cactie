const { token } = require('../config/bot.json');
module.exports = client => {
	client.login(token);
	client.logger.info('Bot logged in');
};