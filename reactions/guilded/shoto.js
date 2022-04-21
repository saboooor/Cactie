module.exports = {
	name: 'shoto',
	description: '😩',
	triggers: ['shoto'],
	execute(message) {
		message.client.messages.addReaction(message.channelId, message.id, 1200709);
		message.client.messages.addReaction(message.channelId, message.id, 90000060);
	},
};