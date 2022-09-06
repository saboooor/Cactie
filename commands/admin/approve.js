const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Collection } = require('discord.js');
const { yes } = require('../../lang/int/emoji.json');
const getTranscript = require('../../functions/getTranscript.js');
const getMessages = require('../../functions/getMessages.js');
const checkPerms = require('../../functions/checkPerms');

module.exports = {
	name: 'approve',
	description: 'Approve a suggestion.',
	ephemeral: true,
	aliases: ['accept'],
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
			if (!suggestMsg && suggestChannel) suggestMsg = !isNaN(messageId) ? await suggestChannel.messages.fetch(messageId).catch(() => { return null; }) : null;
			if (!suggestMsg && message.channel.parent && message.channel.parent.type == ChannelType.GuildText) suggestMsg = !isNaN(messageId) ? await message.channel.parent.messages.fetch(messageId).catch(() => { return null; }) : null;
			if (!suggestMsg) return client.error('Could not find the message.\nTry doing the command in the same channel as the suggestion.', message, true);

			// Check if message was sent by the bot
			if (suggestMsg.author.id != client.user.id) return;

			// Get embed and check if embed is a suggestion
			const ApproveEmbed = new EmbedBuilder(suggestMsg.embeds[0].toJSON());
			if (!ApproveEmbed || !ApproveEmbed.toJSON().author || !ApproveEmbed.toJSON().title.startsWith('Suggestion')) return;

			// Delete command message
			if (!message.commandName) await message.delete().catch(err => logger.error(err));

			// Remove all reactions and set color to green and approved title
			suggestMsg.reactions.removeAll();
			ApproveEmbed.setColor(0x2ECC71)
				.setTitle('Suggestion (Approved)')
				.setFooter({ text: `Approved by ${message.member.user.tag}`, iconURL: message.member.user.avatarURL() });

			// Fetch result / reaction emojis and add field if not already added
			const emojis = [];
			await suggestMsg.reactions.cache.forEach(reaction => {
				let emoji = client.emojis.cache.get(reaction._emoji.id);
				if (!emoji) emoji = reaction._emoji.name;
				emojis.push(`${emoji} **${reaction.count}**`);
			});
			if (!ApproveEmbed.toJSON().fields && emojis.length) ApproveEmbed.addFields([{ name: 'Results', value: `${emojis.join(' ')}` }]);

			// Get suggestion thread
			const thread = message.guild.channels.cache.get(ApproveEmbed.toJSON().url.split('a')[2]);

			// Delete thread if exists with transcript
			if (thread) {
				const permCheck = checkPerms(['ManageThreads'], message.guild.members.me, thread.parent.id);
				if (permCheck) return client.error(permCheck, message, true);
				const messagechunks = await getMessages(thread, 'infinite').catch(err => { logger.error(err); });
				messagechunks.unshift([suggestMsg]);
				const allmessages = new Collection().concat(...messagechunks);
				if (allmessages.size > 2) {
					const link = await getTranscript(allmessages);
					ApproveEmbed.addFields([{ name: 'View Discussion', value: link }]);
				}
				thread.delete();
			}

			// Check if there's a message and put in new field
			if (args.join(' ')) {
				// check if there's a response already, if so, edit the field and don't add a new field
				const field = ApproveEmbed.toJSON().fields ? ApproveEmbed.toJSON().fields.find(f => f.name == 'Response') : null;
				if (field) field.value = args.join(' ');
				else ApproveEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
			}

			// Send approve dm to op
			if (ApproveEmbed.toJSON().url) {
				const member = message.guild.members.cache.get(ApproveEmbed.toJSON().url.split('a')[1]);
				const row = new ActionRowBuilder().addComponents([
					new ButtonBuilder()
						.setURL(suggestMsg.url)
						.setLabel('Go to suggestion')
						.setStyle(ButtonStyle.Link),
				]);
				if (member) {
					member.send({ content: `**Your suggestion at ${message.guild.name} has been approved.**${args.join(' ') ? `\nResponse: ${args.join(' ')}` : ''}`, components: [row] })
						.catch(err => logger.warn(err));
				}
			}

			// Update message and reply with approved
			await suggestMsg.edit({ embeds: [ApproveEmbed] });
			if (message.commandName) message.reply({ content: `<:yes:${yes}> **Suggestion Approved!**` }).catch(() => { return null; });

			// Check if log channel exists and send message
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				ApproveEmbed.setTitle(`${message.member.user.tag} approved a suggestion`).setFields([]);
				if (args.join(' ')) ApproveEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
				const msglink = new ActionRowBuilder()
					.addComponents([new ButtonBuilder()
						.setURL(suggestMsg.url)
						.setLabel('Go to Message')
						.setStyle(ButtonStyle.Link),
					]);
				logchannel.send({ embeds: [ApproveEmbed], components: [msglink] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};