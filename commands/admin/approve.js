module.exports = {
	name: 'approve',
	description: 'Approve a suggestion.',
	aliases: ['accept'],
	args: true,
	permissions: 'ADMINISTRATOR',
	usage: '<Message ID> [Response]',
	guildOnly: true,
	options: require('./suggestresponse.json'),
	async execute(message, args, client) {
		const approving = await message.channel.messages.fetch({ around: args[0], limit: 1 });
		const fetchedMsg = approving.first();
		const Embed = fetchedMsg.embeds[0];
		if (fetchedMsg.author != client.user) return;
		if (!Embed || !Embed.author || !Embed.title.startsWith('Suggestion')) return;
		fetchedMsg.reactions.removeAll();
		Embed.setColor(3066993).setTitle('Suggestion (Approved)');
		if (!args[1]) {
			Embed.setFooter('No response.');
			fetchedMsg.edit({ embeds: [Embed] });
			if (Embed.url) {
				client.users.cache.get(Embed.url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been approved.**` })
					.catch(error => { client.logger.warn(error); });
			}
		}
		else {
			Embed.setFooter(`Response: ${args.slice(1).join(' ')}`);
			fetchedMsg.edit({ embeds: [Embed] });
			if (Embed.url) {
				client.users.cache.get(Embed.url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been approved.**\nResponse: ${args.slice(1).join(' ')}` })
					.catch(error => { client.logger.warn(error); });
			}
		}
		if (message.commandName) message.reply({ content: 'Suggestion Approved!', ephemeral: true });
		else message.delete();
	},
};