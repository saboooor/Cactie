const Discord = require('discord.js');
module.exports = {
	name: 'approve',
	description: 'Approve a suggestion.',
	aliases: ['accept'],
	args: true,
	permissions: 'ADMINISTRATOR',
	usage: '<Message ID> [Response]',
	guildOnly: true,
	options: [{
		type: 3,
		name: 'messageid',
		description: 'The ID of the message of the suggestion you want to approve',
		required: true,
	},
	{
		type: 3,
		name: 'response',
		description: 'Response to the suggestion',
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		else { message.delete(); }
		const approving = await message.channel.messages.fetch({ around: args[0], limit: 1 });
		const fetchedMsg = approving.first();
		if (fetchedMsg.author != client.user) return;
		if (!fetchedMsg.embeds[0] || !fetchedMsg.embeds[0].author || !fetchedMsg.embeds[0].title.startsWith('Suggestion')) return;
		fetchedMsg.reactions.removeAll();
		const Embed = new Discord.MessageEmbed()
			.setColor(3066993)
			.setAuthor(fetchedMsg.embeds[0].author.name, fetchedMsg.embeds[0].author.iconURL)
			.setDescription(fetchedMsg.embeds[0].description)
			.setURL(fetchedMsg.embeds[0].url)
			.setTitle('Suggestion (Approved)');
		if (!args[1]) {
			Embed.setFooter('No response.');
			fetchedMsg.edit({ embeds: [Embed] });
			if (fetchedMsg.embeds[0].url) {
				client.users.cache.get(fetchedMsg.embeds[0].url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been approved.**` })
					.catch(error => { client.logger.error(error); });
			}
		}
		else {
			Embed.setFooter(`Response: ${args.slice(1).join(' ')}`);
			fetchedMsg.edit({ embeds: [Embed] });
			if (fetchedMsg.embeds[0].url) {
				client.users.cache.get(fetchedMsg.embeds[0].url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been approved.**\nResponse: ${args.slice(1).join(' ')}` })
					.catch(error => { client.logger.error(error); });
			}
		}
		if (message.commandName) message.reply({ content: 'Suggestion Approved!', ephemeral: true });
	},
};