module.exports = client => {
	const { token } = require('../config/bot.json');
	client.login(token);
	client.logger.info('Bot logged in!');
};