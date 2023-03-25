const createTicket = require('../functions/tickets/createTicket.js');

module.exports = {
	name: 'ticket_create',
	deferReply: true,
	ephemeral: true,
	async execute(interaction, client) {
		try {
			// Check if tickets are disabled
			const srvconfig = await sql.getData('settings', { guildId: interaction.guild.id });

			// Create a ticket
			const msg = await createTicket(client, srvconfig, interaction.member, interaction.fields.getTextInputValue('description'));

			// Send the message
			interaction.reply(msg);
		}
		catch (err) { client.error(err, interaction); }
	},
};