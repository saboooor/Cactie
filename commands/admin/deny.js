module.exports = {
	name: 'deny',
	description: 'Deny a suggestion',
	aliases: ['reject', 'decline'],
	args: true,
	permissions: 'ADMINISTRATOR',
	usage: '<Message Id> [Response]',
	guildOnly: true,
	options: require('./deny.json'),
	async execute(message, args, client) {
		const approving = await message.channel.messages.fetch({ around: args[0], limit: 1 });
		const fetchedMsg = approving.first();
		const Embed = fetchedMsg.embeds[0];
		if (fetchedMsg.author != client.user) return;
		if (!Embed || !Embed.author || !Embed.title.startsWith('Suggestion')) return;
		fetchedMsg.reactions.removeAll();
		Embed.setColor(15158332).setTitle('Suggestion (Denied)');
		if (!args[1]) {
			Embed.setFooter('No response.');
			fetchedMsg.edit({ embeds: [Embed] });
			if (Embed.url) {
				client.users.cache.get(Embed.url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been denied.**` })
					.catch(error => { client.logger.warn(error); });
			}
		}
		else {
			Embed.setFooter(`Response: ${args.slice(1).join(' ')}`);
			fetchedMsg.edit({ embeds: [Embed] });
			if (Embed.url) {
				client.users.cache.get(Embed.url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been denied.**\nResponse: ${args.slice(1).join(' ')}` })
					.catch(error => { client.logger.warn(error); });
			}
		}
		if (message.commandName) message.reply({ content: 'Suggestion Denied!', ephemeral: true });
		else message.delete();
	},
};