const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const { yes } = require('../../lang/int/emoji.json');

module.exports = {
	name: 'implement',
	description: 'Mark a suggestion as implemented.',
	ephemeral: true,
	aliases: ['implemented', 'impl'],
	args: true,
	permissions: ['Administrator'],
	usage: '<Message ID> [Response (Changes the current one)]',
	options: require('../../options/suggestresponse.js'),
	async execute(message, args, client) {
		try {
			// Fetch the message
			const messageId = args.shift();
			let suggestMsg = !isNaN(messageId) ? await message.channel.messages.fetch(messageId).catch(() => { return null; }) : null;

			// Check if the message exists, if not, check in suggestionchannel, if not, check if it's in parent, if not, return
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const suggestChannel = message.guild.channels.cache.get(srvconfig.suggestionchannel);
			if (!suggestMsg) suggestMsg = !isNaN(messageId) ? await suggestChannel.messages.fetch(messageId).catch(() => { return null; }) : null;
			if (!suggestMsg && message.channel.parent && message.channel.parent.type == ChannelType.GuildText) suggestMsg = !isNaN(messageId) ? await message.channel.parent.messages.fetch(messageId).catch(() => { return null; }) : null;
			if (!suggestMsg) return client.error('Could not find the message.\nTry doing the command in the same channel as the suggestion.', message, true);

			// Check if message was sent by the bot
			if (suggestMsg.author.id != client.user.id) return;

			// Get embed and check if embed is a suggestion
			const ImplementEmbed = new EmbedBuilder(suggestMsg.embeds[0].toJSON());
			if (!ImplementEmbed || !ImplementEmbed.toJSON().author) return;
			if (!ImplementEmbed.toJSON().title.startsWith('Suggestion (Approved)')) return client.error('This suggestion has not been approved yet!\nApprove it first with the approve command.', message, true);

			// Delete command message
			if (!message.commandName) message.delete().catch(err => logger.error(err.stack));

			// Set color to blue and implemented title
			ImplementEmbed.setColor(0x2ECCCC)
				.setTitle('Suggestion (Implemented)');

			// Check if there's a message and put in new field
			if (args.join(' ')) {
				// check if there's a response already, if so, edit the field and don't add a new field
				const field = ImplementEmbed.toJSON().fields ? ImplementEmbed.toJSON().fields.find(f => f.name == 'Response') : null;
				if (field) field.value = args.join(' ');
				else ImplementEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
			}

			// Send implement dm to op
			if (ImplementEmbed.toJSON().url) {
				const member = message.guild.members.cache.get(ImplementEmbed.toJSON().url.split('a')[1]);
				const row = new ActionRowBuilder().addComponents([
					new ButtonBuilder()
						.setURL(suggestMsg.url)
						.setLabel('Go to suggestion')
						.setStyle(ButtonStyle.Link),
				]);
				if (member) {
					member.send({ content: `**Your suggestion at ${message.guild.name} has been implemented.**${args.join(' ') ? `\nResponse: ${args.join(' ')}` : ''}`, components: [row] })
						.catch(err => logger.warn(err));
				}
			}

			// Update message and reply with implemented
			await suggestMsg.edit({ embeds: [ImplementEmbed] });
			if (message.commandName) message.reply({ content: `<:yes:${yes}> **Suggestion Implemented!**` }).catch(() => { return null; });

			// Check if log channel exists and send message
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				ImplementEmbed.setTitle(`${message.member.user.tag} implemented a suggestion`).setFields([]);
				if (args.join(' ')) ImplementEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
				const msglink = new ActionRowBuilder()
					.addComponents([new ButtonBuilder()
						.setURL(suggestMsg.url)
						.setLabel('Go to Message')
						.setStyle(ButtonStyle.Link),
					]);
				logchannel.send({ embeds: [ImplementEmbed], components: [msglink] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};