function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const Discord = require('discord.js');
module.exports = {
	name: 'reopen_ticket',
	async execute(interaction, client) {
		const author = interaction.user;
		if (client.settings.get(interaction.guild.id).tickets == 'false') return interaction.reply('Tickets are disabled!');
		if (!interaction.channel.topic) return interaction.reply('This is not a valid ticket!');
		if (!interaction.channel.topic.includes('Ticket Opened by')) return interaction.reply('This is not a valid ticket!');
		if (interaction.channel.name.includes(`ticket${client.user.username.replace('Pup ', '').toLowerCase()}-`)) return interaction.reply('This ticket is already opened!');
		await interaction.channel.setName(interaction.channel.name.replace('closed', 'ticket'));
		await sleep(1000);
		if (interaction.channel.name.includes(`closed${client.user.username.replace('Pup ', '').toLowerCase()}-`)) return interaction.reply('Failed to open ticket, please try again in 10 minutes');
		client.tickets.get(interaction.channel.id).users.forEach(userid => {
			interaction.channel.updateOverwrite(client.users.cache.get(userid), { VIEW_CHANNEL: true });
		});
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Opened by ${author}`);
		interaction.reply(Embed);
		await sleep(1000);
		client.logger.info(`Reopened ticket #${interaction.channel.name}`);
	},
};