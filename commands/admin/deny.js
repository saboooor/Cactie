const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'deny',
	description: 'Deny a suggestion',
	ephemeral: true,
	aliases: ['reject', 'decline'],
	args: true,
	permission: 'Administrator',
	botperm: 'ManageMessages',
	usage: '<Message Id> [Response]',
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
			if (!fetchedMsg && message.channel.parent.type == ChannelType.GuildText) {
				fetchedMsg = await message.channel.parent.messages.fetch(message.channel.id);
			}
			if (!fetchedMsg) return client.error('Could not find the message, try doing the command in the channel the suggestion was sent in?', message, true);

			// Check if message was sent by the bot
			if (fetchedMsg.author != client.user) return;

			// Get embed and check if embed is a suggestion
			const DenyEmbed = new EmbedBuilder(fetchedMsg.embeds[0].toJSON());
			if (!DenyEmbed || !DenyEmbed.toJSON().author || !DenyEmbed.toJSON().title.startsWith('Suggestion')) return;

			// Remove all reactions and set color to red and denied title
			fetchedMsg.reactions.removeAll();
			DenyEmbed.setColor(0xE74C3C).setTitle('Suggestion (Denied)');

			// Fetch result / reaction emojis and add field if not already added
			const emojis = [];
			await fetchedMsg.reactions.cache.forEach(reaction => {
				let emoji = client.emojis.cache.get(reaction._emoji.id);
				if (!emoji) emoji = reaction._emoji.name;
				emojis.push(`${emoji} **${reaction.count}**`);
			});
			if (!DenyEmbed.toJSON().fields && emojis[0]) DenyEmbed.addFields([{ name: 'Results', value: `${emojis.join(' ')}` }]);

			// Get suggestion thread
			const thread = message.guild.channels.cache.get(DenyEmbed.toJSON().url.split('a')[2]);

			// Delete command message
			if (!message.commandName && !thread) message.delete().catch(err => client.logger.error(err.stack));

			// Delete thread if exists with transcript
			if (thread) {
				if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageThreads) || !message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageThreads)) {
					client.logger.error(`Missing ManageThreads permission in #${message.channel.name} at ${message.guild.name}`);
					return client.error('I don\'t have the ManageThreads permission!', message, true);
				}
				const messages = await thread.messages.fetch({ limit: 100 });
				if (messages.size > 3) {
					const link = await getTranscript(messages);
					DenyEmbed.addFields([{ name: 'View Discussion', value: link }]);
				}
				thread.delete();
			}

			// Check if there's a message and put in new field and send update dm
			if (!isNaN(args[0]) && message.channel.parent.type != ChannelType.GuildText) args = args.slice(1);
			if (args.join(' ')) {
				// check if there's a response already, if so, edit the field and don't add a new field
				let newField = true;
				if (DenyEmbed.toJSON().fields) {
					DenyEmbed.toJSON().fields.forEach(field => {
						if (field.name == 'Response') {
							newField = false;
							field.value = args.join(' ');
						}
					});
				}
				if (newField) DenyEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
			}
			DenyEmbed.setFooter({ text: `Denied by ${message.member.user.tag}`, iconURL: message.member.user.avatarURL() });
			if (DenyEmbed.toJSON().url) {
				const member = message.guild.members.cache.get(DenyEmbed.toJSON().url.split('a')[1]);
				if (member) {
					member.send({ content: `**Your suggestion at ${message.guild.name} has been denied.**${args.join(' ') ? `\nResponse: ${args.join(' ')}` : ''}` })
						.catch(err => client.logger.warn(err));
				}
			}

			// Update message and reply with denied
			await fetchedMsg.edit({ embeds: [DenyEmbed] });
			if (message.commandName) message.reply({ content: 'Suggestion Denied!' });

			// Check if log channel exists and send message
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				DenyEmbed.setTitle(`${message.member.user.tag} denied a suggestion`).setFields([]);
				if (args.join(' ')) DenyEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
				const msglink = new ActionRowBuilder()
					.addComponents([new ButtonBuilder()
						.setURL(fetchedMsg.url)
						.setLabel('Go to Message')
						.setStyle(ButtonStyle.Link),
					]);
				logchannel.send({ embeds: [DenyEmbed], components: [msglink] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};
