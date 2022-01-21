module.exports = {
	name: 'react',
	botperm: 'ADD_REACTIONS',
	args: true,
	async execute(message, args) {
		if (message.author.id !== '249638347306303499') return message.reply({ content: 'You can\'t do that!' });
		const msgs = await message.channel.messages.fetch({ around: args[0], limit: 1 });
		const fetchedMsg = msgs.first();
		fetchedMsg.react(args[1]);
	},
};