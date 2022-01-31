module.exports = {
	name: 'resolved',
	description: 'Mark a ticket as resolved (Closes ticket at 12AM ET)',
	aliases: ['resolve'],
	async execute(message, args, client) {
		try {
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: `This is a subticket!\nYou must use this command in ${message.channel.parent}` });
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');
			if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
			if (ticketData.users.includes(message.member.user.id)) return message.reply({ content: 'You cannot resolve this ticket! Try closing the ticket instead' });
			if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is already closed!' });
			if (ticketData.resolved == 'true') return message.reply({ content: 'This ticket is already marked as resolved!' });
			const users = [];
			ticketData.users.forEach(userid => users.push(client.users.cache.get(userid)));
			await client.setData('ticketdata', 'channelId', message.channel.id, 'resolved', 'true');
			message.reply({ content: `${users}, this ticket has been resolved and will auto-close at 8PM Eastern Time if you do not respond.\nIf you still have an issue, please explain it here. Otherwise, you may close this ticket now.` });
			client.logger.info(`Marked ticket #${message.channel.name} as resolved`);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};