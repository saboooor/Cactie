const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
module.exports = {
	name: 'implement',
	description: 'Mark a suggestion as implemented.',
	ephemeral: true,
	aliases: ['implemented', 'impl'],
	args: true,
	permission: 'Administrator',
	botperm: 'ManageMessages',
	usage: '<Message ID> [Response (Changes the current response)]',
	options: require('../../options/suggestresponse.js'),
	async execute(message, args, client) {
		try {
			// Fetch the message
			let fetchedMsg = !isNaN(args[0]) ? await message.channel.messages.fetch(args[0]) : null;

			// Check if the message exists, if not, check in suggestionchannel, if not, check if it's in thread, if not, return
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (!fetchedMsg) {
				fetchedMsg = !isNaN(args[0]) ? await message.guild.channels.cache.get(srvconfig.suggestionchannel).messages.fetch(args[0]) : null;
			}
			if (!fetchedMsg) return client.error('Could not find the message, try doing the command in the channel the suggestion was sent in?', message, true);

			// Check if message was sent by the bot
			if (fetchedMsg.author != client.user) return;

			// Get embed and check if embed is a suggestion
			const ImplementEmbed = new EmbedBuilder(fetchedMsg.embeds[0].toJSON());
			if (!ImplementEmbed || !ImplementEmbed.toJSON().author || !ImplementEmbed.toJSON().title.startsWith('Suggestion')) return;

			// Set color to blue and implemented title
			ImplementEmbed.setColor(0x2ECCCC).setTitle('Suggestion (Implemented)');

			// Delete command message
			if (!message.commandName) message.delete().catch(err => client.logger.error(err.stack));

			// Check if there's a message and put in new field and send update dm
			if (!isNaN(args[0]) && message.channel.parent.type != ChannelType.GuildText) args = args.slice(1);
			if (args.join(' ')) {
				// check if there's a response already, if so, edit the field and don't add a new field
				let newField = true;
				if (ImplementEmbed.toJSON().fields) {
					ImplementEmbed.toJSON().fields.forEach(field => {
						if (field.name == 'Response') {
							newField = false;
							field.value = args.join(' ');
						}
					});
				}
				if (newField) ImplementEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
			}
			if (ImplementEmbed.toJSON().url) {
				const member = message.guild.members.cache.get(ImplementEmbed.toJSON().url.split('a')[1]);
				if (member) {
					member.send({ content: `**Your suggestion at ${message.guild.name} has been implemented.**${args.join(' ') ? `\nResponse: ${args.join(' ')}` : ''}` })
						.catch(err => client.logger.warn(err));
				}
			}

			// Update message and reply with approved
			await fetchedMsg.edit({ embeds: [ImplementEmbed] });
			if (message.commandName) message.reply({ content: 'Suggestion marked as implemented!' });

			// Check if log channel exists and send message
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				ImplementEmbed.setTitle(`${message.member.user.tag} implemented a suggestion`).setFields([]);
				if (args.join(' ')) ImplementEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
				const msglink = new ActionRowBuilder()
					.addComponents([new ButtonBuilder()
						.setURL(fetchedMsg.url)
						.setLabel('Go to Message')
						.setStyle(ButtonStyle.Link),
					]);
				logchannel.send({ embeds: [ImplementEmbed], components: [msglink] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};
