function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { Embed } = require('discord.js');
module.exports = {
	name: 'reopen_ticket',
	botperm: 'ManageChannels',
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${interaction.channel.id}'`))[0];
			if (!ticketData) return interaction.reply({ content: 'Could not find this ticket in the database, please manually delete this channel.' });
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket is already opened
			if (interaction.channel.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket is already opened!' });

			// Change channel name to opened
			await interaction.channel.setName(interaction.channel.name.replace('closed', 'ticket'));

			// Check if bot got rate limited and ticket didn't properly close
			await sleep(1000);
			if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'Failed to open ticket, please try again in 10 minutes' });

			// Add permissions for each user in the ticket
			ticketData.users.forEach(userid => { interaction.channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: true }); });

			// Reply with ticket open message
			const OpenEmbed = new Embed()
				.setColor(0xFF6400)
				.setDescription(`Ticket Opened by ${interaction.user}`);
			interaction.reply({ embeds: [OpenEmbed] });
			client.logger.info(`Reopened ticket #${interaction.channel.name}`);
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};