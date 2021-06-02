function minTwoDigits(n) {
	return (n < 10 ? '0' : '') + n;
}
module.exports = {
	name: 'resolved',
	description: 'Mark a ticket as resolved (Closes ticket at 12AM ET)',
	aliases: ['resolve'],
	async execute(message, args, client, Client, Discord) {
		const srvconfig = client.settings.get(message.guild.id);
		if (srvconfig.tickets == 'false') return message.reply('Tickets are disabled!');
		if (!message.channel.topic) return message.reply('This is not a valid ticket!');
		if (!message.channel.topic.includes('Ticket Opened by')) return message.reply('This is not a valid ticket!');
		if (client.tickets.get(message.channel.id).users.includes(message.author.id)) return message.reply('You cannot resolve this ticket! Try closing the ticket instead');
		if (message.channel.name.includes('closed-')) return message.reply('This ticket is already closed!');
		if (client.tickets.get(message.channel.id).resolved == 'true') return message.reply('This ticket is already marked as resolved!');
		const users = [];
		client.tickets.get(message.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
		client.tickets.set(message.channel.id, 'true', 'resolved');
		message.channel.send(`${users}, this ticket has been marked as resolved and will close at 12AM ET if you don't respond.\nIf you still have an issue, please explain it here. Otherwise, you can do \`/close\`, \`-close\`, or react to the original message to close the ticket now.`);
		const rn = new Date();
		const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
		console.log(`[${time} INFO]: Marked ticket #${message.channel.name} as resolved`);
	},
};