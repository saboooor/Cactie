const Discord = require('discord.js');
module.exports = {
	name: 'deny',
	description: 'Deny a suggestion.',
	aliases: ['reject', 'decline'],
	args: true,
	permissions: 'ADMINISTRATOR',
	usage: '<Message Id> [Response]',
	guildOnly: true,
	options: [{
		type: 3,
		name: 'messageid',
		description: 'The Id of the message of the suggestion you want to approve',
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
		fetchedMsg.reactions.removeAll();
		const Embed = new Discord.MessageEmbed()
			.setColor(15158332)
			.setAuthor(fetchedMsg.embeds[0].author.name, fetchedMsg.embeds[0].author.iconURL)
			.setDescription(fetchedMsg.embeds[0].description)
			.setURL(fetchedMsg.embeds[0].url)
			.setTitle('Suggestion (Denied)');
		if (!args[1]) {
			Embed.setFooter('No response.');
			fetchedMsg.edit({ embeds: [Embed] });
			if (fetchedMsg.embeds[0].url) client.users.cache.get(fetchedMsg.embeds[0].url.split('a')[1]).send({ content: `**Your suggestion at ${message.guild.name} has been denied.**` });
		}
		else {
			Embed.setFooter(`Response: ${args.slice(1).join(' ')}`);
			fetchedMsg.edit({ embeds: [Embed] });
			if (fetchedMsg.embeds[0].url) client.users.cache.get(fetchedMsg.embeds[0].url.split('a')[1]).send({ content: `**Your suggestion at ${message.guild.name} has been denied.**\nResponse: ${args.slice(1).join(' ')}` });
		}
		if (message.commandName) message.reply({ content: 'Suggestion Denied!', ephemeral: true });
	},
};