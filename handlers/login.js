module.exports = client => {
	const { token } = require('../config/bot.json');
	client.login(token);
	client.logger.log('info', 'Bot logged in!');
};