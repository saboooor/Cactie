const { Embed } = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'clear',
	description: 'Delete multiple messages at once',
	ephemeral: true,
	args: true,
	aliases: ['purge'],
	usage: '<Message Amount>',
	similarcmds: 'clearqueue',
	permission: 'MANAGE_MESSAGES',
	botperm: 'MANAGE_MESSAGES',
	options: require('../options/clear.json'),
	async execute(message, args, client) {
		try {
			// Check if arg is a number and is more than 100
			if (isNaN(args[0])) return message.reply({ content: 'That is not a number!' });
			if (args[0] > 100) return message.reply({ content: 'You can only clear 100 messages at once!' });

			// Fetch the messages and bulk delete them
			const messages = await message.channel.messages.fetch({ limit: args[0] });
			message.channel.bulkDelete(messages);

			// Reply with response
			if (message.commandName) message.reply({ content: `Cleared ${args[0]} messages!` });
			client.logger.info(`Cleared ${args[0]} messages from #${message.channel.name} in ${message.guild.name}`);

			// Check if log channel exists and send message
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				const ClearEmbed = new Embed()
					.setTitle(`${message.member.user.tag} cleared ${args[0]} messages`)
					.addField('Channel', `${message.channel}`)
					.addField('Transcript', `${await getTranscript(messages)}`);
				logchannel.send({ embeds: [ClearEmbed] });
			}
		}
		catch (err) {
			client.error(err, message);
		}
	},
};