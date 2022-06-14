const { EmbedBuilder, Collection } = require('discord.js');
const getTranscript = require('../../../functions/getTranscript.js').discord;
const getMessages = require('../../../functions/getMessages.js');
const { yes } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'clear',
	description: 'Delete multiple messages at once',
	ephemeral: true,
	args: true,
	aliases: ['purge'],
	usage: '<Message Amount> [Message Author] [Message Content Has]',
	similarcmds: 'clearqueue or cleareffects',
	permission: 'ManageMessages',
	botperm: 'ManageMessages',
	options: require('../../options/clear.js'),
	async execute(message, args, client) {
		try {
			// Check if arg is a number and is more than 100
			if (isNaN(args[0])) return client.error('That is not a number!', message, true);
			if (args[0] > 1000) return client.error('You can only clear 1000 messages at once!', message, true);

			// Fetch the messages and bulk delete them
			const messagechunks = await getMessages(message.channel, args[0]);
			const allmessages = new Collection();
			messagechunks.forEach(async messages => {
				messages = messages.filter(msg => msg.createdTimestamp > Date.now() - 1209600);
				if (args[1]) messages = messages.filter(msg => msg.author.id == args[1]);
				if (args[2]) messages = messages.filter(msg => msg.content.includes(args[2]));
				if (!messages.size) return;
				message.channel.bulkDelete(messages).catch(err => client.error(err, message, true));
				allmessages.concat(messages);
			});
			if (!allmessages.size) return client.error('There are no messages in that scope, try a higher number?', message, true);

			// Reply with response
			if (message.commandName) message.reply({ content: `<:yes:${yes}> **Cleared ${allmessages.size} messages!**` });
			client.logger.info(`Cleared ${allmessages.size} messages from #${message.channel.name} in ${message.guild.name}`);

			// Check if log channel exists and send message
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				const ClearEmbed = new EmbedBuilder()
					.setTitle(`${message.member.user.tag} cleared ${allmessages.size} messages`)
					.addFields([
						{ name: 'Channel', value: `${message.channel}` },
						{ name: 'Transcript', value: `${await getTranscript(allmessages)}` },
					]);
				logchannel.send({ embeds: [ClearEmbed] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};