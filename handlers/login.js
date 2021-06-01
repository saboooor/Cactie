module.exports = client => {
	const { token } = require('../config/bot.json');
	client.login(token);
};