function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const Discord = require('discord.js');
module.exports = {
	name: 'reopen_ticket',
	async execute(interaction, client) {
		const author = interaction.user;
		if (client.settings.get(interaction.guild.id).tickets == 'false') return interaction.reply({ content: 'Tickets are disabled!' });
		if (interaction.channel.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket is already opened!' });
		await interaction.channel.setName(interaction.channel.name.replace('closed', 'ticket'));
		await sleep(1000);
		if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'Failed to open ticket, please try again in 10 minutes' });
		client.tickets.get(interaction.channel.id).users.forEach(userid => {
			interaction.channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: true });
		});
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Opened by ${author}`);
		interaction.reply({ embeds: [Embed] });
		await sleep(1000);
		if (!interaction.channel) return;
		client.logger.info(`Reopened ticket #${interaction.channel.name}`);
	},
};