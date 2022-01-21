const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'approve',
	description: 'Approve a suggestion.',
	ephemeral: true,
	aliases: ['accept'],
	args: true,
	permissions: 'ADMINISTRATOR',
	botperm: 'MANAGE_MESSAGES',
	usage: '<Message ID> [Response]',
	options: require('../options/suggestresponse.json'),
	async execute(message, args, client) {
		// Fetch the message
		let approving = !isNaN(args[0]) ? await message.channel.messages.fetch({ around: args[0], limit: 1 }) : null;
		let fetchedMsg = approving ? approving.first() : null;

		// Check if the message exists, if not, check in suggestionchannel, if not, check if it's in thread, if not, return
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		if (!fetchedMsg) {
			approving = !isNaN(args[0]) ? await message.guild.channels.get(srvconfig.suggestionchannel).messages.fetch({ around: args[0], limit: 1 }) : null;
			fetchedMsg = approving ? approving.first() : null;
		}
		if (!fetchedMsg && message.channel.parent.type == 'GUILD_TEXT') {
			approving = await message.channel.parent.messages.fetch({ around: message.channel.id, limit: 1 });
			fetchedMsg = approving ? approving.first() : null;
		}
		if (!fetchedMsg) return message.reply({ content: 'Could not find the message, try doing the command in the channel the suggestion was sent in?' });

		// Check if message was sent by the bot
		if (fetchedMsg.author != client.user) return;

		// Get embed and check if embed is a suggestion
		const Embed = fetchedMsg.embeds[0];
		if (!Embed || !Embed.author || !Embed.title.startsWith('Suggestion')) return;

		// Remove all reactions and set color to green and approved title
		fetchedMsg.reactions.removeAll();
		Embed.setColor(3066993).setTitle('Suggestion (Approved)');

		// Fetch results / reactions and add field if not already added
		const emojis = [];
		await fetchedMsg.reactions.cache.forEach(reaction => {
			let emoji = `<a:${reaction._emoji.name}:${reaction._emoji.id}> ${reaction.count}`;
			if (!reaction._emoji.animated) emoji = emoji.replace('a', '');
			emojis.push(emoji);
		});
		if (!Embed.fields[0] && emojis[0]) Embed.addField('Results­', `${emojis.join(' ')}`);

		// Delete command message
		if (!message.commandName) message.delete();

		// Get suggestion thread if exists and delete with transcript
		const thread = message.guild.channels.cache.get(Embed.url.split('a')[2]);
		if (thread) {
			if (!message.guild.me.permissions.has('MANAGE_THREADS') || !message.guild.me.permissionsIn(message.channel).has('MANAGE_THREADS')) {
				client.logger.error(`Missing MANAGE_THREADS permission in #${message.channel.name} at ${message.guild.name}`);
				return message.reply({ content: 'I don\'t have the MANAGE_THREADS permission!' });
			}
			const messages = await thread.messages.fetch({ limit: 100 });
			if (messages.size > 1) {
				const link = await getTranscript(messages);
				Embed.addField('View Discussion', link);
			}
			thread.delete();
		}

		// Check if there's a message and put in footer and send update dm
		if (!args[1]) {
			Embed.setFooter({ text: `Approved by ${message.member.user.tag}.`, iconURL: message.member.user.avatarURL({ dynamic : true }) });
			if (Embed.url) {
				client.users.cache.get(Embed.url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been approved.**` })
					.catch(error => { client.logger.warn(error); });
			}
		}
		else {
			if (!isNaN(args[0])) args = args.slice(1);
			Embed.setFooter({ text: `${message.member.user.tag}: ${args.join(' ')}`, iconURL: message.member.user.avatarURL({ dynamic : true }) });
			if (Embed.url) {
				client.users.cache.get(Embed.url.split('a')[1])
					.send({ content: `**Your suggestion at ${message.guild.name} has been approved.**\nResponse: ${args.join(' ')}` })
					.catch(error => { client.logger.warn(error); });
			}
		}

		// Update message and reply with approved
		fetchedMsg.edit({ embeds: [Embed] });
		if (message.commandName) message.reply({ content: 'Suggestion Approved!' });

		// Check if log channel exists and send message
		const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
		if (logchannel) {
			Embed.setTitle(`${message.member.user.tag} approved a suggestion`)
				.addField('Link to message', `[Click here](${fetchedMsg.url})`);
			logchannel.send({ embeds: [Embed] });
		}
	},
};