function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const Discord = require('discord.js');
module.exports = {
	name: 'open',
	description: 'Repen a ticket',
	aliases: ['reopen'],
	async execute(message, user, client, reaction) {
		let author = message.member.user;
		if (reaction) {
			if (message.author.id != client.user.id) return;
			author = user;
		}
		if (client.settings.get(message.guild.id).tickets == 'false') return message.reply('Tickets are disabled!');
		if (!message.channel.topic) return message.reply('This is not a valid ticket!');
		if (!message.channel.topic.includes('Ticket Opened by')) return message.reply('This is not a valid ticket!');
		if (message.channel.name.includes(`ticket${client.user.username.replace('Pup ', '').toLowerCase()}-`)) return message.reply('This ticket is already opened!');
		await message.channel.setName(message.channel.name.replace('closed', 'ticket'));
		await sleep(1000);
		if (message.channel.name.includes(`closed${client.user.username.replace('Pup ', '').toLowerCase()}-`)) return message.reply('Failed to open ticket, please try again in 10 minutes');
		client.tickets.get(message.channel.id).users.forEach(userid => {
			message.channel.updateOverwrite(client.users.cache.get(userid), { VIEW_CHANNEL: true });
		});
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Opened by ${author}`);
		message.reply(Embed);
		await sleep(1000);
		client.logger.info(`Reopened ticket #${message.channel.name}`);
	},
};