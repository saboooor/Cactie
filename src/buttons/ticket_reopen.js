const reopenTicket = require('../functions/tickets/reopenTicket').default;

module.exports = {
	name: 'reopen_ticket',
	botPerms: ['ManageChannels'],
	deferReply: true,
	async execute(interaction) {
		try {
			// Get the server config
			const srvconfig = await sql.getData('settings', { guildId: interaction.guild.id });

			// Create a ticket
			const msg = await reopenTicket(srvconfig, interaction.member, interaction.channel);

			// Send the message
			interaction.reply(msg);
		}
		catch (err) { error(err, interaction, true); }
	},
};