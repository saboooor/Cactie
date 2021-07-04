module.exports = {
	name: 'resolved',
	description: 'Mark a ticket as resolved (Closes ticket at 12AM ET)',
	aliases: ['resolve'],
	async execute(message, args, client, Client) {
		const srvconfig = client.settings.get(message.guild.id);
		if (!client.tickets.get(message.channel.id) || !client.tickets.get(message.channel.id).opener) return;
		if (srvconfig.tickets == 'false') return message.reply('Tickets are disabled!');
		if (client.tickets.get(message.channel.id).users.includes(message.member.user.id)) return message.reply('You cannot resolve this ticket! Try closing the ticket instead');
		if (message.channel.name.includes(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply('This ticket is already closed!');
		if (client.tickets.get(message.channel.id).resolved == 'true') return message.reply('This ticket is already marked as resolved!');
		const users = [];
		client.tickets.get(message.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
		client.tickets.set(message.channel.id, 'true', 'resolved');
		message.reply(`${users}, this ticket has been marked as resolved and will close at 12AM ET if you don't respond.\nIf you still have an issue, please explain it here. Otherwise, you can do \`/close\`, \`-close\`, or react to the original message to close the ticket now.`);
		client.logger.info(`Marked ticket #${message.channel.name} as resolved`);
	},
};