const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Collection } = require('discord.js');
const { no } = require('../../lang/int/emoji.json');
const getTranscript = require('../../functions/getTranscript.js');
const getMessages = require('../../functions/getMessages.js');
const checkPerms = require('../../functions/checkPerms');

module.exports = {
	name: 'deny',
	description: 'Deny a suggestion.',
	ephemeral: true,
	aliases: ['reject', 'decline'],
	args: true,
	permissions: ['Administrator'],
	usage: '<Message Id> [Response]',
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
			const DenyEmbed = new EmbedBuilder(suggestMsg.embeds[0].toJSON());
			if (!DenyEmbed || !DenyEmbed.toJSON().author || !DenyEmbed.toJSON().title.startsWith('Suggestion')) return;

			// Delete command message
			if (!message.commandName) await message.delete().catch(err => logger.error(err));

			// Remove all reactions and set color to red and denied title
			suggestMsg.reactions.removeAll();
			DenyEmbed.setColor(0xE74C3C)
				.setTitle('Suggestion (Denied)')
				.setFooter({ text: `Denied by ${message.member.user.tag}`, iconURL: message.member.user.avatarURL() })
				.setTimestamp();

			// Fetch result / reaction emojis and add field if not already added
			const emojis = [];
			await suggestMsg.reactions.cache.forEach(reaction => {
				let emoji = client.emojis.cache.get(reaction._emoji.id);
				if (!emoji) emoji = reaction._emoji.name;
				emojis.push(`${emoji} **${reaction.count}**`);
			});
			if (!DenyEmbed.toJSON().fields && emojis.length) DenyEmbed.addFields([{ name: 'Results', value: `${emojis.join(' ')}` }]);

			// Get suggestion thread
			const thread = message.guild.channels.cache.get(DenyEmbed.toJSON().url.split('a')[2]);

			// Delete thread if exists with transcript
			if (thread) {
				const permCheck = checkPerms(['ManageThreads'], message.guild.members.me, thread.parent.id);
				if (permCheck) return client.error(permCheck, message, true);
				const messagechunks = await getMessages(thread, 'infinite').catch(err => { logger.error(err); });
				messagechunks.unshift(new Collection().set(`${suggestMsg.id}`, suggestMsg));
				const allmessages = new Collection().concat(...messagechunks);
				if (allmessages.size > 2) {
					const link = await getTranscript(allmessages);
					DenyEmbed.addFields([{ name: 'View Discussion', value: link }]);
				}
				thread.delete();
			}

			// Check if there's a message and put in new field
			if (args.join(' ')) {
				// check if there's a response already, if so, edit the field and don't add a new field
				const field = DenyEmbed.toJSON().fields ? DenyEmbed.toJSON().fields.find(f => f.name == 'Response') : null;
				if (field) field.value = args.join(' ');
				else DenyEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
			}

			// Send deny dm to op
			if (DenyEmbed.toJSON().url) {
				const member = message.guild.members.cache.get(DenyEmbed.toJSON().url.split('a')[1]);
				const row = new ActionRowBuilder().addComponents([
					new ButtonBuilder()
						.setURL(suggestMsg.url)
						.setLabel('Go to suggestion')
						.setStyle(ButtonStyle.Link),
				]);
				if (member) {
					member.send({ content: `**Your suggestion at ${message.guild.name} has been denied.**${args.join(' ') ? `\nResponse: ${args.join(' ')}` : ''}`, components: [row] })
						.catch(err => logger.warn(err));
				}
			}

			// Update message and reply with denied
			await suggestMsg.edit({ embeds: [DenyEmbed] });
			if (message.commandName) message.reply({ content: `<:no:${no}> **Suggestion Denied!**` }).catch(() => { return null; });

			// Check if log channel exists and send message
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				DenyEmbed.setTitle(`${message.member.user.tag} denied a suggestion`).setFields([]);
				if (args.join(' ')) DenyEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
				const msglink = new ActionRowBuilder()
					.addComponents([new ButtonBuilder()
						.setURL(suggestMsg.url)
						.setLabel('Go to Message')
						.setStyle(ButtonStyle.Link),
					]);
				logchannel.send({ embeds: [DenyEmbed], components: [msglink] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};