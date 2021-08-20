module.exports = {
	name: 'resolved',
	description: 'Mark a ticket as resolved (Closes ticket at 12AM ET)',
	aliases: ['resolve'],
	async execute(message, args, client) {
		const srvconfig = client.settings.get(message.guild.id);
		if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply(`This is a subticket!\nYou must use this command in ${message.channel.parent}`);
		if (!client.tickets.get(message.channel.id) || !client.tickets.get(message.channel.id).opener) return;
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		if (client.tickets.get(message.channel.id).users.includes(message.member.user.id)) return message.reply({ content: 'You cannot resolve this ticket! Try closing the ticket instead' });
		if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is already closed!' });
		if (client.tickets.get(message.channel.id).resolved == 'true') return message.reply({ content: 'This ticket is already marked as resolved!' });
		const users = [];
		client.tickets.get(message.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
		client.tickets.set(message.channel.id, 'true', 'resolved');
		message.reply({ content: `${users}, this ticket has been resolved and will auto-close at 8PM Eastern Time if you do not respond.\nIf you still have an issue, please explain it here. Otherwise, you may close this ticket now.` });
		client.logger.info(`Marked ticket #${message.channel.name} as resolved`);
	},
};