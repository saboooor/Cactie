const Discord = require('discord.js');
module.exports = {
	name: 'reset_confirm',
	permissions: 'ADMINISTRATOR',
	async execute(interaction, client) {
		client.settings.delete(interaction.guild.id);
		const button = new Discord.MessageButton()
			.setCustomID('none')
			.setLabel('Settings successfully reset!')
			.setStyle('SECONDARY');
		const row = new Discord.MessageActionRow()
			.addComponents(button);
		const desc = {
			prefix: '*The bot\'s prefix (You can use double quotes (") to include spaces)*',
			simpreaction: '*Reacts with "SIMP" on messages with simpy words (true/false)*',
			leavemessage: '*Can be either false or the message text itself.\nVariables: {USER MENTION} {USER TAG}*',
			joinmessage: '*Can be either false or the message text itself.\nVariables: {USER MENTION} {USER TAG}*',
			adfree: '*Gets rid of all references to other servers (true/false)*',
			maxppsize: '*Maximum pp size in pp and instapp commands*',
			tickets: '*Enables tickets (true/false)*',
			bonercmd: '*Toggles boner command (true/false)*',
			ticketlogchannel: '*The channel where the bot puts transcripts of tickets\nCan be either false or the channel ID*',
			ticketcategory: '*The category where the bot creates tickets in\nMust be a category ID*',
			supportrole: '*The ticket support team role\nCan be either false or the role ID*',
			ticketmention: '*Pings @everyone every time a new ticket is created*',
		};
		const srvconfig = Object.keys(client.settings.get(interaction.guild.id)).map(prop => {
			return `**${prop}**\n${desc[prop]}\n\`${client.settings.get(interaction.guild.id)[prop]}\``;
		});
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Bot Settings')
			.setDescription(srvconfig.join('\n'))
			.addField('Usage', `\`${client.settings.get(interaction.guild.id).prefix}settings [<Setting> <Value>]\``);
		interaction.update({ embeds: [Embed], components: [row] });
	},
};