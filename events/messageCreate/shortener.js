const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { createPaste } = require('hastebin');
module.exports = async (client, message) => {
	// Check if author is a bot or message is in dm
	if (message.webhookId || message.author.bot || message.channel.isDMBased()) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

	// If message shortener is set and is smaller than the amount of lines in the message, delete the message and move the message into bin.birdflop.com
	if (message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageMessages)
		&& message.content.split('\n').length > srvconfig.msgshortener
		&& srvconfig.msgshortener != '0'
		&& message.author.id !== '249638347306303499'
		&& (!message.member.permissions
			|| (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)
				&& !message.member.permissionsIn(message.channel).has(PermissionsBitField.Flags.Administrator)
				&& !message.member.roles.cache.has(srvconfig.adminrole)
			)
		)
	) {
		message.delete().catch(err => client.logger.error(err.stack));
		const link = await createPaste(message.content, { server: 'https://bin.birdflop.com' });
		const shortEmbed = new EmbedBuilder()
			.setColor('Random')
			.setTitle('Shortened long message')
			.setAuthor({ name: message.member.displayName, iconURL: message.member.user.avatarURL() })
			.setDescription(link)
			.setFooter({ text: 'Next time please use a paste service for long messages' });
		message.channel.send({ embeds: [shortEmbed] });
		client.logger.info(`Shortened message from ${message.author.tag} in #${message.channel.name} at ${message.guild.name}`);
	}
};