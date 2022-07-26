const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'reopen_ticket',
	botperm: 'ManageChannels',
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${interaction.channel.id}'`))[0];
			if (!ticketData) return client.error('Could not find this ticket in the database, please manually delete this channel.', interaction, true);
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket is already opened
			if (interaction.channel.name.startsWith('ticket')) return client.error('This ticket is already opened!', interaction, true);

			// Change channel name to opened
			await interaction.channel.setName(interaction.channel.name.replace('closed', 'ticket'));

			// Check if bot got rate limited and ticket didn't properly close
			await sleep(1000);
			if (interaction.channel.name.startsWith('closed')) return client.error('Failed to open ticket, please try again in 10 minutes', interaction, true);

			// Add permissions for each user in the ticket
			await ticketData.users.forEach(userid => interaction.channel.permissionOverwrites.edit(userid, { ViewChannel: true }));

			// Reply with ticket open message
			const OpenEmbed = new EmbedBuilder()
				.setColor(0xFF6400)
				.setDescription(`Ticket Opened by ${interaction.user}`);
			interaction.reply({ embeds: [OpenEmbed] });
			client.logger.info(`Reopened ticket #${interaction.channel.name}`);
		}
		catch (err) { client.error(err, interaction); }
	},
};