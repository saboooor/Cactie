const createVoice = require('../functions/tickets/createVoice.js');

module.exports = {
	name: 'voiceticket_create',
	botperm: 'ManageChannels',
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Check if tickets are disabled
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);

			// Create a ticket
			const msg = await createVoice(client, srvconfig, interaction.member, interaction.channel);

			// Send the message
			interaction.reply(msg);
		}
		catch (err) { client.error(err, interaction, true); }
	},
};