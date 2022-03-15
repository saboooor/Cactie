module.exports = {
	name: 'cactiebad',
	triggers: ['bad', 'gross', 'shit', 'dum'],
	additionaltriggers: ['cactie'],
	execute(message) {
		message.react('🇳').catch(err => message.client.logger.error(err));
		message.react('🇴').catch(err => message.client.logger.error(err));
	},
};