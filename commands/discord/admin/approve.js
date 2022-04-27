const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const getTranscript = require('../../../functions/getTranscript.js');
module.exports = {
	name: 'approve',
	description: 'Approve a suggestion.',
	ephemeral: true,
	aliases: ['accept'],
	args: true,
	permission: 'Administrator',
	botperm: 'ManageMessages',
	usage: '<Message ID> [Response]',
	options: require('../options/suggestresponse.js'),
	async execute(message, args, client) {
		try {
			// Fetch the message
			let approving = !isNaN(args[0]) ? await message.channel.messages.fetch({ around: args[0], limit: 1 }) : null;
			let fetchedMsg = approving ? approving.first() : null;

			// Check if the message exists, if not, check in suggestionchannel, if not, check if it's in thread, if not, return
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (!fetchedMsg) {
				approving = !isNaN(args[0]) ? await message.guild.channels.cache.get(srvconfig.suggestionchannel).messages.fetch({ around: args[0], limit: 1 }) : null;
				fetchedMsg = approving ? approving.first() : null;
			}
			if (!fetchedMsg && message.channel.parent.isText()) {
				approving = await message.channel.parent.messages.fetch({ around: message.channel.id, limit: 1 });
				fetchedMsg = approving ? approving.first() : null;
			}
			if (!fetchedMsg) return client.error('Could not find the message, try doing the command in the channel the suggestion was sent in?', message, true);

			// Check if message was sent by the bot
			if (fetchedMsg.author != client.user) return;

			// Get embed and check if embed is a suggestion
			const ApproveEmbed = new EmbedBuilder(fetchedMsg.embeds[0].toJSON());
			if (!ApproveEmbed || !ApproveEmbed.toJSON().author || !ApproveEmbed.toJSON().title.startsWith('Suggestion')) return;

			// Remove all reactions and set color to green and approved title
			fetchedMsg.reactions.removeAll();
			ApproveEmbed.setColor(0x2ECC71).setTitle('Suggestion (Approved)');

			// Fetch result / reaction emojis and add field if not already added
			const emojis = [];
			await fetchedMsg.reactions.cache.forEach(reaction => {
				let emoji = client.emojis.cache.get(reaction._emoji.id);
				if (!emoji) emoji = reaction._emoji.name;
				emojis.push(`${emoji} **${reaction.count}**`);
			});
			if (!ApproveEmbed.toJSON().fields && emojis[0]) ApproveEmbed.addFields([{ name: 'Results', value: `${emojis.join(' ')}` }]);

			// Delete command message
			if (!message.commandName) message.delete().catch(err => client.logger.error(err.stack));

			// Get suggestion thread
			const thread = message.guild.channels.cache.get(ApproveEmbed.toJSON().url.split('a')[2]);

			// Delete command message
			if (!message.commandName && !thread) message.delete().catch(err => client.logger.error(err.stack));

			// Delete thread if exists with transcript
			if (thread) {
				if (!message.guild.me.permissions.has(PermissionsBitField.Flags.ManageThreads) || !message.guild.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageThreads)) {
					client.logger.error(`Missing ManageThreads permission in #${message.channel.name} at ${message.guild.name}`);
					return client.error('I don\'t have the ManageThreads permission!', message, true);
				}
				const messages = await thread.messages.fetch({ limit: 100 });
				if (messages.size > 3) {
					const link = await getTranscript(messages);
					ApproveEmbed.addFields([{ name: 'View Discussion', value: link }]);
				}
				thread.delete();
			}

			// Check if there's a message and put in new field and send update dm
			if (!isNaN(args[0]) && !message.channel.parent.isText()) args = args.slice(1);
			if (args.join(' ')) {
				// check if there's a response already, if so, edit the field and don't add a new field
				let newField = true;
				if (ApproveEmbed.toJSON().fields) {
					ApproveEmbed.toJSON().fields.forEach(field => {
						if (field.name == 'Response') {
							newField = false;
							field.value = args.join(' ');
						}
					});
				}
				if (newField) ApproveEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
			}
			ApproveEmbed.setFooter({ text: `Approved by ${message.member.user.tag}`, iconURL: message.member.user.avatarURL() });
			if (ApproveEmbed.toJSON().url) {
				message.guild.members.cache.get(ApproveEmbed.toJSON().url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been approved.**${args.join(' ') ? `\nResponse: ${args.join(' ')}` : ''}` })
					.catch(err => client.logger.warn(err));
			}

			// Update message and reply with approved
			await fetchedMsg.edit({ embeds: [ApproveEmbed] });
			if (message.commandName) message.reply({ content: 'Suggestion Approved!' });

			// Check if log channel exists and send message
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				ApproveEmbed.setTitle(`${message.member.user.tag} approved a suggestion`).setFields([]);
				if (args.join(' ')) ApproveEmbed.addFields([{ name: 'Response', value: args.join(' ') }]);
				const msglink = new ActionRowBuilder()
					.addComponents([new ButtonBuilder()
						.setURL(fetchedMsg.url)
						.setLabel('Go to Message')
						.setStyle(ButtonStyle.Link),
					]);
				logchannel.send({ embeds: [ApproveEmbed], components: [msglink] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};