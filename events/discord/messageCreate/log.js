const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
module.exports = async (client, message) => {
	// Check if message was sent in a guild
	if (!message.guild || message.author.bot) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

	// Check if log is enabled and send log
	if (['messagecreate', 'other'].some(logtype => srvconfig.auditlogs.split(',').includes(logtype))) {
		const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
		if (!logchannel) return;
		const logEmbed = new EmbedBuilder()
			.setColor(0x2f3136)
			.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
			.setTitle('Message created')
			.setFields([
				{ name: 'Channel', value: `${message.channel}` },
				{ name: 'Content', value: `${message.content ? message.content : 'None'}` },
			]);
		if (message.attachments.first()) {
			if (message.attachments.first().contentType.startsWith('image')) logEmbed.setImage(message.attachments.first().url);
			else logEmbed.addField('Attachment', message.attachments.first().url);
		}
		const row = new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder()
					.setURL(message.url)
					.setLabel('Go to message')
					.setStyle(ButtonStyle.Link),
			]);
		const embeds = [logEmbed];
		if (message.embeds.length) embeds.push(...message.embeds);
		logchannel.send({ embeds, components: [row] }).catch(err => client.logger.error(err));
	}
};