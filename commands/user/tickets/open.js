function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
function minTwoDigits(n) { return (n < 10 ? '0' : '') + n; }
const Discord = require('discord.js');
module.exports = {
	name: 'open',
	description: 'Repen a ticket',
	aliases: ['reopen'],
	async execute(message, user, client, reaction) {
		let author = message.author;
		if (reaction) {
			if (message.author.id != client.user.id) return;
			author = user;
		}
		if (client.settings.get(message.guild.id).tickets == 'false') return message.reply('Tickets are disabled!');
		if (!message.channel.topic) return message.reply('This is not a valid ticket!');
		if (!message.channel.topic.includes('Ticket Opened by')) return message.reply('This is not a valid ticket!');
		if (message.channel.name.includes('ticket-')) return message.reply('This ticket is already opened!');
		await message.channel.setName(message.channel.name.replace('closed', 'ticket'));
		await sleep(1000);
		if (message.channel.name.includes('closed-')) return message.channel.send('Failed to open ticket, please try again in 10 minutes');
		client.tickets.get(message.channel.id).users.forEach(userid => {
			message.channel.updateOverwrite(client.users.cache.get(userid), { VIEW_CHANNEL: true });
		});
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Opened by ${author}`);
		message.channel.send(Embed);
		await sleep(1000);
		const rn = new Date();
		const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
		console.log(`[${time} INFO]: Reopened ticket #${message.channel.name}`);
	},
};