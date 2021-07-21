module.exports = {
	name: 'pupbad',
	triggers: ['bad', 'gross', 'shit', 'dum'],
	additionaltriggers: ['pup'],
	execute(message) {
		message.react('🇳');
		message.react('🇴');
	},
};