const { Embed } = require('guilded.js');
module.exports = {
	name: 'poll',
	description: 'Create a poll!',
	cooldown: 10,
	args: true,
	usage: '<Question>',
	async execute(message, args, client) {
		try {
			const Poll = new Embed()
				.setColor(0x5662f6)
				.setTitle('Poll')
				.setAuthor(message.member.user.name, message.member.user.avatar)
				.setDescription(args.join(' '));
			const pollMsg = await message.send({ embeds: [Poll] });
			await message.client.messages.addReaction(pollMsg.channelId, pollMsg.id, 90002171);
			await message.client.messages.addReaction(pollMsg.channelId, pollMsg.id, 90002176);
		}
		catch (err) { client.error(err, message); }
	},
};