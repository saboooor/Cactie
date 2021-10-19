module.exports = {
	name: 'approve',
	description: 'Approve a suggestion.',
	aliases: ['accept'],
	args: true,
	permissions: 'ADMINISTRATOR',
	usage: '<Message ID> [Response]',
	guildOnly: true,
	options: require('../options/suggestresponse.json'),
	async execute(message, args, client) {
		// Fetch the message
		const approving = await message.channel.messages.fetch({ around: args[0], limit: 1 });
		const fetchedMsg = approving.first();

		// Check if message was sent by the bot
		if (fetchedMsg.author != client.user) return;

		// Get embed and check if embed is a suggestion
		const Embed = fetchedMsg.embeds[0];
		if (!Embed || !Embed.author || !Embed.title.startsWith('Suggestion')) return;

		// Remove all reactions and set color to green and approved title
		fetchedMsg.reactions.removeAll();
		Embed.setColor(3066993).setTitle('Suggestion (Approved)');

		// Check if there's a message and put in footer and send update dm
		if (!args[1]) {
			Embed.setFooter('No response.');
			if (Embed.url) {
				client.users.cache.get(Embed.url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been approved.**` })
					.catch(error => { client.logger.warn(error); });
			}
		}
		else {
			Embed.setFooter(`Response: ${args.slice(1).join(' ')}`);
			if (Embed.url) {
				client.users.cache.get(Embed.url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been approved.**\nResponse: ${args.slice(1).join(' ')}` })
					.catch(error => { client.logger.warn(error); });
			}
		}

		// Update message and reply with approved
		fetchedMsg.edit({ embeds: [Embed] });
		if (message.commandName) message.reply({ content: 'Suggestion Approved!', ephemeral: true });
		else message.delete();
	},
};