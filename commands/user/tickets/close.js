function sleep(ms) {
	return new Promise(res => setTimeout(res, ms));
}
function minTwoDigits(n) {
	return (n < 10 ? '0' : '') + n;
}
const Discord = require('discord.js');
module.exports = {
	name: 'close',
	description: 'Close a ticket',
	async execute(message, user, client, reaction) {
		let author = message.author;
		if (reaction) {
			if (message.author.id != client.user.id) return;
			author = user;
		}
		const srvconfig = client.settings.get(message.guild.id);
		if (srvconfig.tickets == 'false') return message.reply('Tickets are disabled!');
		if (!message.channel.topic) return message.reply('This is not a valid ticket!');
		if (!message.channel.topic.includes('Ticket Opened by')) return message.reply('This is not a valid ticket!');
		if (message.channel.name.includes('closed-')) return message.reply('This ticket is already closed!');
		if (client.tickets.get(message.channel.id).users.includes(author.id)) {
			if (author.id != client.tickets.get(message.channel.id).opener) return message.reply('You can\'t close this ticket!');
		}
		message.channel.setName(message.channel.name.replace('ticket', 'closed'));
		await sleep(1000);
		if (message.channel.name.includes('ticket-')) return message.channel.send('Failed to close ticket, please try again in 10 minutes');
		client.tickets.set(message.channel.id, 'false', 'resolved');
		client.tickets.get(message.channel.id).users.forEach(userid => {
			message.channel.updateOverwrite(client.users.cache.get(userid), { VIEW_CHANNEL: false });
		});
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Closed by ${author}`);
		message.channel.send(Embed);
		Embed.setColor(3447003).setDescription(`🔓 Reopen Ticket \`${srvconfig.prefix}open\` \`/open\`\n⛔ Delete Ticket \`${srvconfig.prefix}delete\` \`/delete\``);
		const msg = await message.channel.send(Embed);
		msg.react('🔓');
		msg.react('⛔');
		const rn = new Date();
		const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
		console.log(`[${time} INFO]: Closed ticket #${message.channel.name}`);
	},
};