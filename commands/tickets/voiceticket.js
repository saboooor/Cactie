const createVoice = require('../../functions/tickets/createVoice.js');
module.exports = {
	name: 'voiceticket',
	description: 'Create a voiceticket',
	ephemeral: true,
	aliases: ['voicenew', 'voice'],
	botperm: 'ManageChannels',
	async execute(message, args, client) {
		try {
			// Check if tickets are disabled
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

			// Create a ticket
			const msg = await createVoice(client, srvconfig, message.member, message.channel);

			// Send the message
			message.reply(msg);
		}
		catch (err) { client.error(err, message); }
	},
};