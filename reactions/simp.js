module.exports = {
	name: 'simp',
	description: 'SIMP',
	triggers: ['lov', 'simp', ' ily ', ' ily', ' babe ', 'babe ', ' babe', 'kiss', 'cute'],
	execute(message) {
		message.react('🇸');
		message.react('🇮');
		message.react('🇲');
		message.react('🇵');
	},
};