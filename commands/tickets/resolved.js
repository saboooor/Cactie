module.exports = {
	name: 'resolved',
	description: 'Mark a ticket as resolved (Closes ticket at 12AM ET)',
	aliases: ['resolve'],
	async execute(message, args, client) {
		try {
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Only the support team can resolve tickets
			if (ticketData.users.includes(message.member.user.id)) return message.reply({ content: 'You cannot resolve this ticket! Try closing the ticket instead' });

			// Check if ticket is closed
			if (message.channel.name.startsWith('closed')) return client.error('This ticket is already closed!', message, true);

			// Set resolved to true
			await client.setData('ticketdata', 'channelId', message.channel.id, 'resolved', 'true');

			// Ping everyone in the ticket
			const users = [];
			await ticketData.users.forEach(userid => users.push(message.guild.members.cache.get(userid).user));

			// Send message to ticket and log
			message.reply({ content: `${users}, this ticket has been resolved and will auto-close at 8PM Eastern Time if you do not respond.\nIf you still have an issue, please explain it here. Otherwise, you may close this ticket now.` });
			client.logger.info(`Marked ticket #${message.channel.name} as resolved`);
		}
		catch (err) { client.error(err, message); }
	},
};