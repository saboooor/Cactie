const { Embed } = require('guilded.js');
const getTranscript = require('../../../functions/getTranscript.js').guilded;
module.exports = {
	name: 'clear',
	description: 'Delete multiple messages at once',
	args: true,
	aliases: ['purge'],
	usage: '<Message Amount>',
	permission: 'ManageMessages',
	botperm: 'ManageMessages',
	async execute(message, args, client) {
		try {
			return client.error('Admin commands are currently unavailable due to a lack of API endpoint.', message);

			// Check if arg is a number and is more than 100
			if (isNaN(args[0])) return client.error('That is not a number!', message, true);
			if (args[0] > 50) return client.error('You can only clear 50 messages at once!', message, true);

			// Fetch the messages and bulk delete them
			const messages = await client.messages.fetchMany(message.channelId, { limit: args[0] });
			messages.forEach(msg => {
				client.messages.delete(msg.channelId, msg.id);
			});
			const channel = await client.channels.fetch(message.channelId);
			client.logger.info(`Cleared ${args[0]} messages from #${channel.name}`);

			// Check if log channel exists and send message
			const srvconfig = await client.getData('settings', 'guildId', message.serverId);
			if (srvconfig.logchannel && srvconfig.logchannel != 'false') {
				const ClearEmbed = new Embed()
					.setTitle(`${message.member.user.name} cleared ${args[0]} messages`)
					.addFields([
						{ name: 'Channel', value: `#${channel.name}` },
						{ name: 'Transcript', value: `${await getTranscript(messages)}` },
					]);
				client.messages.send(srvconfig.logchannel, { embeds: [ClearEmbed] });
			}
		}
		catch (err) { client.error(err, message); }
	},
};