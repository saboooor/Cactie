const { Embed } = require('guilded.js');
module.exports = {
	name: 'embed',
	description: 'Embed',
	cooldown: 0.1,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		try {
			const embed = new Embed()
				.setTitle('balls');
			message.send({ content: 'a', embeds: [embed], replyMessageIds: [message.id] });
		}
		catch (err) { client.error(err, message); }
	},
};