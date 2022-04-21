module.exports = {
	name: 'simp',
	triggers: ['lov', 'simp', ' ily ', ' ily', 'kiss', 'cute'],
	execute(message) {
		message.client.messages.addReaction(message.channelId, message.id, 1200710);
	},
};