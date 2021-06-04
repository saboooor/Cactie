const Discord = require('discord.js');
module.exports = {
	name: 'deny',
	description: 'Deny a suggestion.',
	aliases: ['reject', 'decline'],
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
		if (message.commandName) {
			args = Array.from(args); args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		else {
			message.delete();
		}
		const approving = await message.channel.messages.fetch({ around: args[0], limit: 1 });
		const fetchedMsg = approving.first();
		fetchedMsg.reactions.removeAll();
		const Embed = new Discord.MessageEmbed()
			.setColor(15158332)
			.setAuthor(fetchedMsg.embeds[0].author.name, fetchedMsg.embeds[0].author.iconURL)
			.setDescription(fetchedMsg.embeds[0].description)
			.setTitle('Suggestion (Denied)');
		if (!args[1]) {
			Embed.setFooter('No response.');
			fetchedMsg.edit(Embed);
		}
		else {
			Embed.setFooter(`Response:${args.join(' ').replace(args[0], '')}`);
			fetchedMsg.edit(Embed);
		}
		if (message.commandName) message.reply('Suggestion Approved!', { ephemeral: true });
	},
};