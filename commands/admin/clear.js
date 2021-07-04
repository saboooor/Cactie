module.exports = {
	name: 'clear',
	description: 'Delete multiple messages at once',
	aliases: ['purge'],
	args: true,
	usage: '<Message Amount>',
	permissions: 'MANAGE_MESSAGES',
	guildOnly: true,
	options: [{
		type: 4,
		name: 'amount',
		description: 'The amount of messages to clear',
		required: true,
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
			if (args[0] > 100) return message.reply({ content: 'You can only clear 100 messages at once!', ephemeral: true });
		}
		else if (args[0] > 100) {
			return message.reply({ content: 'You can only clear 100 messages at once!' });
		}
		await message.channel.messages.fetch({ limit: args[0] }).then(messages => {
			message.channel.bulkDelete(messages).catch(e => message.channel.send(`\`${`${e}`.split('at')[0]}\``));
		});
		if (message.channel.name == 'global') {
			const consolechannel = message.guild.channels.cache.find(c => c.name.includes('console'));
			if (!consolechannel) return;
			consolechannel.send('clearchat');
		}
		if (message.commandName) message.reply({ content: `Cleared ${args[0]} messages!`, ephemeral: true });
		client.logger.info(`Cleared ${args[0]} messages from #${message.channel.name} in ${message.guild.name}`);
	},
};