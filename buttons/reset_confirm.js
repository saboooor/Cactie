const Discord = require('discord.js');
module.exports = {
	name: 'reset_confirm',
	permissions: 'ADMINISTRATOR',
	async execute(interaction, client) {
		client.settings.delete(interaction.guild.id);
		const button = new Discord.MessageButton()
			.setCustomId('none')
			.setLabel('Settings successfully reset!')
			.setStyle('SECONDARY');
		const row = new Discord.MessageActionRow()
			.addComponents(button);
		const desc = {
			prefix: '*The bot\'s prefix*',
			reactions: '*Reacts with various reactions on some words (true/false)*\nDo /reactions to see a list of them',
			leavemessage: '*The message when someone leaves the guild. (<message>/false)\nVariables: {USER MENTION} {USER TAG}*',
			joinmessage: '*The message when someone joins the guild. (<message>/false)\nVariables: {USER MENTION} {USER TAG}*',
			adfree: '*Gets rid of all references to other servers (true/false)*',
			maxppsize: '*Maximum pp size in boner and instaboner commands (<75)*',
			tickets: '*Toggles the ticket system (buttons/reactions/false)*',
			bonercmd: '*Toggles the boner command (true/false)*',
			suggestionchannel: '*The channel where the bot puts suggestions in (false/default/channelId)*',
			pollchannel: '*The channel where the bot puts polls in (false/default/channelId)*',
			ticketlogchannel: '*The channel where the bot puts ticket logs (false/channelId)*',
			ticketcategory: '*The category where the bot creates tickets in (false/categoryId)*',
			supportrole: '*The ticket support team role (roleId)*',
			ticketmention: '*Pings @everyone every time a new ticket is created (true/false)*',
			muterole: '*The role for muting someone (false/roleId)*',
			mutecmd: '*Toggles the mute command (true/false)*',
			adminrole: '*The role to replace the ADMINISTRATOR permission (permission/roleId)*',
			msgshortener: '*The amount of lines in a message to trigger message shortener (number [0 = false])*',
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