const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'clear',
	description: 'Delete multiple messages at once',
	aliases: ['purge'],
	usage: '<Message Amount>',
	permissions: 'MANAGE_MESSAGES',
	guildOnly: true,
	options: require('./clear.json'),
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
		if (!args[0]) {
			const Usage = new MessageEmbed()
				.setColor(3447003)
				.setTitle('Usage')
				.setDescription('`/clear <Message Amount>`')
				.setFooter('Did you mean to use /clearqueue?');
			return message.reply({ embeds: [Usage] });
		}
		if (args[0] > 100) return message.reply({ content: 'You can only clear 100 messages at once!', ephemeral: true });
		if (isNaN(args[0])) return message.reply({ content: 'That is not a number!', ephemeral: true });
		await message.channel.messages.fetch({ limit: args[0] }).then(messages => {
			message.channel.bulkDelete(messages).catch(e => message.channel.send({ content: `\`${`${e}`.split('at')[0]}\`` }));
		});
		if (message.commandName) message.reply({ content: `Cleared ${args[0]} messages!`, ephemeral: true });
		client.logger.info(`Cleared ${args[0]} messages from #${message.channel.name} in ${message.guild.name}`);
	},
};