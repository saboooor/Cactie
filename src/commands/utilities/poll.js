const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { yes, no } = require('../../misc/emoji.json');
const checkPerms = require('../../functions/checkPerms').default;

module.exports = {
	name: 'poll',
	description: 'Create a poll!',
	ephemeral: true,
	cooldown: 10,
	args: true,
	usage: 'create <Question> OR end <Message Id>',
	options: require('../../options/poll').default,
	async execute(message, args, client) {
		try {
			// Get server config
			const srvconfig = await sql.getData('settings', { guildId: message.guild.id });

			// Get channel to send poll in
			let channel = message.guild.channels.cache.get(srvconfig.pollchannel);
			if (!channel) channel = message.channel;

			// Check permissions in that channel
			const permCheck = checkPerms(['ViewChannel', 'SendMessages', 'AddReactions'], message.guild.members.me, channel);
			if (permCheck) return error(permCheck, message, true);

			const cmd = args.shift();
			const msg = args.join();
			if (cmd == 'create') {
				// Create poll embed
				const pollEmbed = new EmbedBuilder()
					.setColor(0x2f3136)
					.setTitle('Poll')
					.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL(), url: `https://a${message.member.id}a.cactie` })
					.setDescription(msg);

				// Send poll message and react
				const pollMsg = await channel.send({ embeds: [pollEmbed] });
				await pollMsg.react(yes);
				await pollMsg.react(no);

				// Send response message if command is slash command or different channel
				if (channel.id == message.channel.id && message.commandName) return message.reply({ content: '**Poll Created!**' });
				if (channel.id != message.channel.id) return message.reply({ content: `**Poll Created at ${channel}!**` });
			}
			else if (cmd == 'end') {
				// Check permissions in that channel
				const permCheck2 = checkPerms(['ReadMessageHistory', 'ManageMessages'], message.guild.members.me, channel);
				if (permCheck2) return error(permCheck2, message, true);

				// Check if the message exists, if not, check in suggestionchannel, if not, return
				const pollMsg = !isNaN(msg) ? await channel.messages.fetch(msg).catch(() => { return null; }) : null;
				if (!pollMsg) return error('Could not find the message.\nTry doing the command in the same channel as the poll.', message, true);

				// Check if message was sent by the bot
				if (pollMsg.author.id != client.user.id) return;

				// Get embed and check if embed is a suggestion
				const pollEmbed = new EmbedBuilder(pollMsg.embeds[0].toJSON());
				if (!pollEmbed || !pollEmbed.toJSON().author || !pollEmbed.toJSON().title.startsWith('Poll')) return;

				// Check if user is the one who posted the poll
				if (message.member.id != pollEmbed.toJSON().author.url.split('a')[1]) return message.reply('You didn\'t create this poll!');

				// Delete command message
				if (!message.commandName) await message.delete().catch(err => logger.error(err));

				// Remove all reactions and set color to green and approved title
				pollMsg.reactions.removeAll();
				pollEmbed.setTitle('Poll (Ended)')
					.setTimestamp();

				// Fetch result / reaction emojis and add field if not already added
				const emojis = [];
				await pollMsg.reactions.cache.forEach(reaction => {
					let emoji = client.emojis.cache.get(reaction._emoji.id);
					if (!emoji) emoji = reaction._emoji.name;
					emojis.push(`${emoji} **${reaction.count}**`);
				});
				if (!pollEmbed.toJSON().fields && emojis.length) pollEmbed.addFields([{ name: 'Results', value: `${emojis.join(' ')}` }]);

				// Update message and reply with approved
				await pollMsg.edit({ embeds: [pollEmbed] });
				if (message.commandName) message.reply({ content: `<:yes:${yes}> **Poll Ended!**` }).catch(() => { return null; });

				// Check if log channel exists and send message
				const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
				if (logchannel) {
					pollEmbed.setTitle(`${message.member.user.tag} ended their poll`).setFields([]);
					const msglink = new ActionRowBuilder()
						.addComponents([new ButtonBuilder()
							.setURL(pollMsg.url)
							.setLabel('Go to Message')
							.setStyle(ButtonStyle.Link),
						]);
					logchannel.send({ embeds: [pollEmbed], components: [msglink] });
				}
			}

		}
		catch (err) { error(err, message); }
	},
};