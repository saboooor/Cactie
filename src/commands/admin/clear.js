const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require('discord.js');
const getTranscript = require('../../functions/getTranscript').default;
const getMessages = require('../../functions/getMessages').default;
const { yes, no } = require('../../misc/emoji.json');

module.exports = {
	name: 'clear',
	description: 'Delete multiple messages at once',
	ephemeral: true,
	args: true,
	aliases: ['purge'],
	usage: '<Message Amount> [Message Author] [Message Content Has]',
	channelPermissions: ['ManageMessages'],
	botChannelPerms: ['ManageMessages'],
	options: require('../../options/clear').default,
	async execute(message, args) {
		try {
			// Check if arg is a number and is more than 100
			if (isNaN(args[0])) return error('That is not a number!', message, true);
			if (args[0] > 1000) return error('You can only clear 1000 messages at once!', message, true);

			// Fetch the messages and bulk delete them 100 by 100
			const messagechunks = await getMessages(message.channel, args[0]).catch(err => { logger.error(err); });
			for (const i in messagechunks) {
				messagechunks[i] = messagechunks[i].filter(msg => msg.createdTimestamp > Date.now() - 1209600000);
				if (args[1]) messagechunks[i] = messagechunks[i].filter(msg => msg.author.id == args[1]);
				if (args[2]) messagechunks[i] = messagechunks[i].filter(msg => msg.content.includes(args[2]));
				if (!messagechunks[i].size) return;
				await message.channel.bulkDelete(messagechunks[i]).catch(err => error(err, message, true));
			}

			// Combine all message chunks and see if any messages are in there
			const allmessages = new Collection().concat(...messagechunks);
			if (!allmessages.size) return error('There are no messages in that scope, try a higher number?', message, true);

			// Reply with response
			if (message.commandName) message.reply({ content: `<:yes:${yes}> **Cleared ${allmessages.size} messages!**` });
			logger.info(`Cleared ${allmessages.size} messages from #${message.channel.name} in ${message.guild.name}`);

			// Check if log channel exists and send message
			const srvconfig = await sql.getData('settings', { guildId: message.guild.id });
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (!logchannel) return;

			// Create log embed
			const logEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setAuthor({ name: message.member.user.tag, iconURL: message.member.user.avatarURL() })
				.setTitle(`<:no:${no}> ${allmessages.size} Messages bulk-deleted`)
				.setFields([
					{ name: 'Channel', value: `${message.channel}`, inline: true },
					{ name: 'Transcript', value: `${await getTranscript(allmessages)}` },
				]);

			// Create abovemessage button if above message is found
			const components = [];
			const aboveMessages = await message.channel.messages.fetch({ before: allmessages.first().id, limit: 1 }).catch(() => { return null; });
			if (aboveMessages && aboveMessages.first()) {
				const aboveMessage = aboveMessages.first();
				components.push(
					new ActionRowBuilder()
						.addComponents([
							new ButtonBuilder()
								.setURL(aboveMessage.url)
								.setLabel('Go to above message')
								.setStyle(ButtonStyle.Link),
						]),
				);
			}

			// Send log
			logchannel.send({ embeds: [logEmbed], components }).catch(err => logger.error(err));
		}
		catch (err) { error(err, message); }
	},
};