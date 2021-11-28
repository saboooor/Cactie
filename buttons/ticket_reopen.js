function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'reopen_ticket',
	botperms: 'MANAGE_CHANNELS',
	async execute(interaction, client) {
		interaction.deferUpdate();
		// Check if ticket is already opened
		if (interaction.channel.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket is already opened!' });

		// Change channel name to opened
		await interaction.channel.setName(interaction.channel.name.replace('closed', 'ticket'));

		// Check if bot got rate limited and ticket didn't properly close
		await sleep(1000);
		if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'Failed to open ticket, please try again in 10 minutes' });

		// Add permissions for each user in the ticket
		client.tickets.get(interaction.channel.id).users.forEach(userid => { interaction.channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: true }); });

		// Reply with ticket open message
		const Embed = new MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Opened by ${interaction.user}`);
		interaction.reply({ embeds: [Embed] });
		client.logger.info(`Reopened ticket #${interaction.channel.name}`);
	},
};