const closeTicket = require('../functions/tickets/closeTicket').default;

module.exports = {
	name: 'close_ticket',
	botPerms: ['ManageChannels'],
	deferReply: true,
	ephemeral: true,
	async execute(interaction) {
		try {
			// Check if tickets are disabled
			const srvconfig = await sql.getData('settings', { guildId: interaction.guild.id });

			// Create a ticket
			const msg = await closeTicket(srvconfig, interaction.member, interaction.channel);

			// Send the message
			interaction.reply(msg);
		}
		catch (err) { error(err, interaction, true); }
	},
};