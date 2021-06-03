const Discord = require('discord.js');
module.exports = {
	name: 'settings',
	description: 'Configure Pup\'s Guild settings',
	aliases: ['setting'],
	cooldown: 1,
	permissions: 'ADMINISTRATOR',
	async execute(message, args, client) {
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Bot Settings');
		if (args[1]) {
			if (args[0] == 'pollchannel' || args[0] == 'suggestionchannel' || args[0] == 'ticketlogchannel' || args[0] == 'ticketcategory') {
				if (args[1] != 'false' && args[1] != 'default') {
					if (!client.channels.cache.get(args[1])) return message.reply('That isn\'t a valid channel!');
				}
			}
			if (args[0] == 'maxppsize') {
				if (args[1] > 75) return message.reply('You can\'t set maxppsize to a number over 75!');
			}
			if (['simpreaction', 'adfree', 'listsort', 'tickets'].some(word => args[0].toLowerCase().includes(word))) {
				if (!['true', 'false'].some(word => args[1].toLowerCase().includes(word))) return message.reply('You can only set this as true or false!');
			}
			const [prop, ...value] = args;
			if(!client.settings.has(message.guild.id, prop)) {
				return message.reply('Invalid setting!');
			}
			client.settings.set(message.guild.id, value.join(' ').replace(/"/g, ''), prop);
			Embed.setDescription(`Successfully set \`${prop}\` to \`${value.join(' ').replace(/"/g, '')}\``);
		}
		else {
			const desc = {
				prefix: '*The bot\'s prefix (You can use double quotes (") to include spaces)*',
				simpreaction: '*Reacts with "SIMP" on messages with simpy words (true/false)*',
				leavemessage: '*Can be either false or the message text itself.\nVariables: {USER MENTION} {USER TAG}*',
				joinmessage: '*Can be either false or the message text itself.\nVariables: {USER MENTION} {USER TAG}*',
				adfree: '*Gets rid of all references to other servers (true/false)*',
				maxppsize: '*Maximum pp size in pp and instapp commands*',
				tickets: '*Enables tickets (true/false)*',
				bonercmd: '*Toggles boner command (true/false)*',
				suggestionchannel: '*The channel where the bot puts suggestions in\nCan be either false, default, or the channel ID*',
				pollchannel: '*The channel where the bot puts polls in\nCan be either false, default, or the channel ID*',
				ticketlogchannel: '*The channel where the bot puts transcripts of tickets\nCan be either false or the channel ID*',
				ticketcategory: '*The category where the bot creates tickets in\nMust be a category ID*',
				supportrole: '*The ticket support team role\nCan be either false or the role ID*',
				ticketmention: '*Pings @everyone every time a new ticket is created*',
			};
			const srvconfig = Object.keys(client.settings.get(message.guild.id)).map(prop => {
				return `**${prop}**\n${desc[prop]}\n\`${client.settings.get(message.guild.id)[prop]}\``;
			});
			Embed.setDescription(srvconfig.join('\n')).addField('Usage', `\`${client.settings.get(message.guild.id).prefix}settings [<Setting> <Value>]\``);
		}
		const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomID('reset')
					.setLabel('Reset Settings')
					.setStyle('DANGER'),
			);
		message.reply({ embed: Embed, components: [row] });
	},
};