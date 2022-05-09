const { EmbedBuilder } = require('discord.js');
const getTranscript = require('../../../functions/getTranscript.js').discord;
const { yes } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'clear',
	description: 'Delete multiple messages at once',
	ephemeral: true,
	args: true,
	aliases: ['purge'],
	usage: '<Message Amount> [User to clear the messages of]',
	similarcmds: 'clearqueue',
	permission: 'ManageMessages',
	botperm: 'ManageMessages',
	options: require('../../options/clear.js'),
	async execute(message, args, client) {
		try {
			// Check if arg is a number and is more than 100
			if (isNaN(args[0])) return client.error('That is not a number!', message, true);
			if (args[0] > 100) return client.error('You can only clear 100 messages at once!', message, true);

			// Fetch the messages and bulk delete them
			let messages = await message.channel.messages.fetch({ limit: args[0] });
			if (args[1]) messages = messages.filter(msg => msg.author.id == args[1]);
			message.channel.bulkDelete(messages).catch(err => client.error(err, message, true));

			// Reply with response
			if (message.commandName) message.reply({ content: `<:yes:${yes}> **Cleared ${message.size} messages!**` });
			client.logger.info(`Cleared ${message.size} messages from #${message.channel.name} in ${message.guild.name}`);

			// Check if log channel exists and send message
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				const ClearEmbed = new EmbedBuilder()
					.setTitle(`${message.member.user.tag} cleared ${message.size} messages`)
					.addFields([
						{ name: 'Channel', value: `${message.channel}` },
						{ name: 'Transcript', value: `${await getTranscript(messages)}` },
					]);
				logchannel.send({ embeds: [ClearEmbed] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};