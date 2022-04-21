module.exports = {
	name: 'cactiebad',
	triggers: ['bad', 'gross', 'shit', 'dum'],
	additionaltriggers: ['cactie'],
	execute(message) {
		message.client.messages.addReaction(message.channelId, message.id, 90002568);
	},
};