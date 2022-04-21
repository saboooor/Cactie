module.exports = {
	name: 'mad',
	triggers: ['mad', 'angry', 'kill ', 'punch', 'evil'],
	execute(message) {
		message.client.messages.addReaction(message.channelId, message.id, 1200708);
	},
};