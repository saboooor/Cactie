module.exports = {
	name: 'pupbad',
	triggers: ['bad', 'gross', 'shit', 'dum'],
	additionaltriggers: ['pup'],
	execute(message) {
		message.react('🇳').catch(err => message.client.logger.error(err));
		message.react('🇴').catch(err => message.client.logger.error(err));
	},
};