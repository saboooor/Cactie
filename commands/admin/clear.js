module.exports = {
	name: 'clear',
	description: 'Delete multiple messages at once',
	args: true,
	aliases: ['purge'],
	usage: '<Message Amount>',
	similarcmds: 'clearqueue',
	permissions: 'MANAGE_MESSAGES',
	guildOnly: true,
	options: require('../options/clear.json'),
	async execute(message, args, client) {
		// Check if arg is a number and is more than 100
		if (isNaN(args[0])) return message.reply({ content: 'That is not a number!', ephemeral: true });
		if (args[0] > 100) return message.reply({ content: 'You can only clear 100 messages at once!', ephemeral: true });

		// Fetch the messages and bulk delete them
		const messages = await message.channel.messages.fetch({ limit: args[0] });
		message.channel.bulkDelete(messages).catch(e => message.channel.send({ content: `\`${`${e}`.split('at')[0]}\`` }));

		// Reply with response
		if (message.commandName) message.reply({ content: `Cleared ${args[0]} messages!`, ephemeral: true });
		client.logger.info(`Cleared ${args[0]} messages from #${message.channel.name} in ${message.guild.name}`);
	},
};