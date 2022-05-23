function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
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
			// Check if user is owner
			if (!message.member.isOwner) return client.error('You need to be the server owner to use this command!', message, true);

			// Check if arg is a number and is more than 100
			if (isNaN(args[0])) return client.error('That is not a number!', message, true);
			if (args[0] > 100) return client.error('You can only clear 100 messages at once!', message, true);

			// Fetch the messages and bulk delete them
			const messages = await client.messages.fetchMany(message.channelId, { limit: args[0] });
			messages.forEach(async (msg) => await msg.delete());
			const channel = await client.channels.fetch(message.channelId);

			// log the action
			client.logger.info(`Cleared ${messages.size} messages from #${channel.name}`);
			const clearMsg = await message.reply({ content: `Cleared ${messages.size} messages!` });

			// Check if log channel exists and send message
			const srvconfig = await client.getData('settings', 'guildId', message.serverId);
			if (srvconfig.logchannel && srvconfig.logchannel != 'false') {
				const ClearEmbed = new Embed()
					.setTitle(`${message.member.user.name} cleared ${messages.size} messages`)
					.addFields([
						{ name: 'Channel', value: `#${channel.name}` },
						{ name: 'Transcript', value: `${await getTranscript(messages)}` },
					]);
				client.messages.send(srvconfig.logchannel, { embeds: [ClearEmbed] });
			}

			// Delete the message after 5 seconds
			await sleep(5000);
			await clearMsg.delete();
		}
		catch (err) { client.error(err, message); }
	},
};