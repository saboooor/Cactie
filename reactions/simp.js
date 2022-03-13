module.exports = {
	name: 'simp',
	triggers: ['lov', 'simp', ' ily ', ' ily', 'kiss', 'cute'],
	execute(message) {
		message.react('896483408753082379').catch(err => message.client.logger.error(err));
	},
};