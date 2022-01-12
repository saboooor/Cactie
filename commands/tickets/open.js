function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'open',
	description: 'Repen a ticket',
	aliases: ['reopen'],
	botperms: 'MANAGE_CHANNELS',
	async execute(message, user, client, reaction) {
		let author = message.member.user;
		if (reaction) {
			if (message.author.id != client.user.id) return;
			author = user;
		}
		if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply(`This is a subticket!\nYou must use this command in ${message.channel.parent}`);
		// Check if ticket is an actual ticket
		const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
		if (!ticketData) return;
		if (ticketData.users) ticketData.users = ticketData.users.split(',');
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		if (message.channel.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is already opened!' });
		await message.channel.setName(message.channel.name.replace('closed', 'ticket'));
		await sleep(1000);
		if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'Failed to open ticket, please try again in 10 minutes' });
		ticketData.users.forEach(userid => {
			message.channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: true });
		});
		const Embed = new MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Opened by ${author}`);
		message.reply({ embeds: [Embed] });
		await sleep(1000);
		client.logger.info(`Reopened ticket #${message.channel.name}`);
	},
};