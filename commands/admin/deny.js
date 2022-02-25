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
	options: require('../options/suggestresponse.json'),
	async execute(message, args, client) {
		try {
			// Fetch the message
			let denying = !isNaN(args[0]) ? await message.channel.messages.fetch({ around: args[0], limit: 1 }) : null;
			let fetchedMsg = denying ? denying.first() : null;

			// Check if the message exists, if not, check in suggestionchannel, if not, check if it's in thread, if not, return
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (!fetchedMsg) {
				denying = !isNaN(args[0]) ? await message.guild.channels.cache.get(srvconfig.suggestionchannel).messages.fetch({ around: args[0], limit: 1 }) : null;
				fetchedMsg = denying ? denying.first() : null;
			}
			if (!fetchedMsg && message.channel.parent.isText()) {
				denying = await message.channel.parent.messages.fetch({ around: message.channel.id, limit: 1 });
				fetchedMsg = denying ? denying.first() : null;
			}
			if (!fetchedMsg) return message.reply({ content: 'Could not find the message, try doing the command in the channel the suggestion was sent in?' });

			// Check if message was sent by the bot
			if (fetchedMsg.author != client.user) return;

			// Get embed and check if embed is a suggestion
			const DenyEmbed = fetchedMsg.embeds[0];
			if (!DenyEmbed || !DenyEmbed.author || !DenyEmbed.title.startsWith('Suggestion')) return;

			// Remove all reactions and set color to red and denied title
			fetchedMsg.reactions.removeAll();
			DenyEmbed.setColor(0xE74C3C).setTitle('Suggestion (Denied)');

			// Fetch results / reactions and add field if not already added
			const emojis = [];
			await fetchedMsg.reactions.cache.forEach(reaction => {
				let emoji = `<a:${reaction._emoji.name}:${reaction._emoji.id}> ${reaction.count}`;
				if (!reaction._emoji.animated) emoji = emoji.replace('a', '');
				emojis.push(emoji);
			});
			if (!DenyEmbed.fields && emojis[0]) DenyEmbed.addField({ name: 'Results', value: `${emojis.join(' ')}` });

			// Get suggestion thread
			const thread = message.guild.channels.cache.get(DenyEmbed.url.split('a')[2]);

			// Delete command message
			if (!message.commandName && !thread) message.delete();

			// Delete thread if exists with transcript
			if (thread) {
				if (!message.guild.me.permissions.has('MANAGE_THREADS') || !message.guild.me.permissionsIn(message.channel).has('MANAGE_THREADS')) {
					client.logger.error(`Missing MANAGE_THREADS permission in #${message.channel.name} at ${message.guild.name}`);
					return message.reply({ content: 'I don\'t have the MANAGE_THREADS permission!' });
				}
				const messages = await thread.messages.fetch({ limit: 100 });
				if (messages.size > 2) {
					const link = await getTranscript(messages);
					DenyEmbed.addField({ name: 'View Discussion', value: link });
				}
				thread.delete();
			}

			// Check if there's a message and put in new field and send update dm
			if (!isNaN(args[0]) && !message.channel.parent.isText()) args = args.slice(1);
			if (args.join(' ')) {
				// check if there's a response already, if so, edit the field and don't add a new field
				let newField = true;
				if (DenyEmbed.fields) {
					DenyEmbed.fields.forEach(field => {
						if (field.name == 'Response') {
							newField = false;
							field.value = args.join(' ');
						}
					});
				}
				if (newField) DenyEmbed.addField({ name: 'Response', value: args.join(' ') });
			}
			DenyEmbed.setFooter({ text: `Denied by ${message.member.user.tag}`, iconURL: message.member.user.avatarURL({ dynamic : true }) });
			if (DenyEmbed.url) {
				client.users.cache.get(DenyEmbed.url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been denied.**${args.join(' ') ? `\nResponse: ${args.join(' ')}` : ''}` })
					.catch(error => { client.logger.warn(error); });
			}

			// Update message and reply with denied
			fetchedMsg.edit({ embeds: [DenyEmbed] });
			if (message.commandName) message.reply({ content: 'Suggestion Denied!' });

			// Check if log channel exists and send message
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				DenyEmbed.setTitle(`${message.member.user.tag} denied a suggestion`)
					.addField({ name: 'Link to message', value: `[Click here](${fetchedMsg.url})` });
				logchannel.send({ embeds: [DenyEmbed] });
			}
		}
		catch (err) {
			client.error(err, message);
		}
	},
};