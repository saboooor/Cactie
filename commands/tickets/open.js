function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { Embed } = require('discord.js');
module.exports = {
	name: 'open',
	description: 'Repen a ticket',
	aliases: ['reopen'],
	botperm: 'ManageChannels',
	async execute(message, user, client, reaction) {
		try {
			let author = message.member.user;
			if (reaction) {
				if (message.author.id != client.user.id) return;
				author = user;
			}
			if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: `This is a subticket!\nYou must use this command in ${message.channel.parent}` });
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
				message.channel.permissionOverwrites.edit(client.users.cache.get(userid), { ViewChannel: true });
			});
			const OpenEmbed = new Embed()
				.setColor(0xFF6400)
				.setDescription(`Ticket Opened by ${author}`);
			message.reply({ embeds: [OpenEmbed] });
			await sleep(1000);
			client.logger.info(`Reopened ticket #${message.channel.name}`);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};