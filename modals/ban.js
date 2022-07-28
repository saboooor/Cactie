const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'kick',
	deferReply: true,
	ephemeral: true,
	async execute(interaction, client, lang, memberId) {
		try {
			// Get user and check if user is valid
			let member = interaction.guild.members.cache.get(memberId);
			if (!member) member = await interaction.guild.members.fetch(memberId);
			if (!member) return client.error(lang.invalidmember, interaction, true);

			// Get member and author and check if role is lower than member's role
			const author = interaction.member;
			if (member.roles.highest.rawPosition > author.roles.highest.rawPosition) return client.error(`You can't do that! Your role is ${member.roles.highest.rawPosition - author.roles.highest.rawPosition} lower than the user's role!`, interaction, true);

			// Get amount of time to ban, if not specified, then permanent
			const timeField = interaction.fields.getTextInputValue('time');
			const time = ms(timeField ? timeField : 'perm');
			if (time > 31536000000) return client.error('You cannot ban someone for more than 1 year!', interaction, true);

			// Create embed and check if bqn has a reason / time period
			const BanEmbed = new EmbedBuilder()
				.setColor('Random')
				.setTitle(`Banned ${member.user.tag} ${!isNaN(time) ? `for ${timeField}` : 'forever'}.`);

			// Add reason if specified
			const reason = interaction.fields.getTextInputValue('reason');
			if (reason) BanEmbed.addFields([{ name: 'Reason', value: reason }]);

			// Send ban message to target
			await member.send({ content: `**You've been banned from ${interaction.guild.name} ${!isNaN(time) ? `for ${timeField}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}**` })
				.catch(err => {
					logger.warn(err);
					interaction.reply({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
				});
			logger.info(`Banned user: ${member.user.tag} from ${interaction.guild.name} ${!isNaN(time) ? `for ${timeField}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}`);

			// Set unban timestamp to member data for auto-unban
			if (!isNaN(time)) await client.setData('memberdata', 'memberId', `${member.id}-${interaction.guild.id}`, 'bannedUntil', Date.now() + time);

			// Actually ban the dude
			await member.ban({ reason: `${author.user.tag} banned user: ${member.user.tag} from ${interaction.guild.name} ${!isNaN(time) ? `for ${timeField}` : 'forever'}.${reason ? ` Reason: ${reason}` : ''}` });

			// Reply with response
			await interaction.reply({ embeds: [BanEmbed] });

			// Check if log channel exists and send message
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			const logchannel = interaction.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				BanEmbed.setTitle(`${author.user.tag} ${BanEmbed.toJSON().title}`);
				logchannel.send({ embeds: [BanEmbed] });
			}
		}
		catch (err) { client.error(err, interaction); }
	},
};