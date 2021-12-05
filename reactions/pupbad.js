module.exports = {
	name: 'pupbad',
	triggers: ['bad', 'gross', 'shit', 'dum'],
	additionaltriggers: ['pup'],
	execute(message) {
		message.react('🇳').catch(e => { message.client.logger.error(e); });
		message.react('🇴').catch(e => { message.client.logger.error(e); });
	},
};