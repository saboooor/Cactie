module.exports = {
	name: 'pupbad',
	description: 'pup bad',
	triggers: ['bad', 'gross', 'shit', 'dum'],
	additionaltriggers: ['pup'],
	execute(message) {
		message.react('🇳');
		message.react('🇴');
	},
};