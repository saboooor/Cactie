const createVoice = require('../functions/tickets/createVoice').default;

module.exports = {
	name: 'voiceticket_create',
	botPerms: ['ManageChannels'],
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Check if tickets are disabled
			const srvconfig = await sql.getData('settings', { guildId: interaction.guild.id });

			// Create a ticket
			const msg = await createVoice(client, srvconfig, interaction.member, interaction.channel);

			// Send the message
			interaction.reply(msg);
		}
		catch (err) { error(err, interaction, true); }
	},
};