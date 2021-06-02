function minTwoDigits(n) {
	return (n < 10 ? '0' : '') + n;
}
module.exports = {
	name: 'remove',
	description: 'Remove someone from a ticket',
	args: true,
	usage: '<User Mention or ID>',
	async execute(message, args, client, Client, Discord) {
		if (client.settings.get(message.guild.id).tickets == 'false') return message.reply('Tickets are disabled!');
		if (!message.channel.topic) return message.reply('This is not a valid ticket!');
		if (!message.channel.topic.includes('Ticket Opened by')) return message.reply('This is not a valid ticket!');
		if (message.channel.name.includes('closed-')) return message.reply('This ticket is closed!');
		const user = client.users.cache.find(u => u.id === args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!client.tickets.get(message.channel.id).users.includes(user.id)) return message.reply('This user isn\'t in this ticket!');
		if (user.id == client.tickets.get(message.channel.id).opener) return message.reply('You can\'t remove the ticket opener!');
		client.tickets.remove(message.channel.id, user.id, 'users');
		message.channel.updateOverwrite(user, { VIEW_CHANNEL: false });
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`${message.author} removed ${user} from the ticket`);
		message.channel.send(Embed);
		const rn = new Date();
		const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
		console.log(`[${time} INFO]: Removed ${user.username} from #${message.channel.name}`);
	},
};