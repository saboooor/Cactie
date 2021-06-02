function minTwoDigits(n) { return (n < 10 ? '0' : '') + n; }
const hastebin = require('hastebin');
const Discord = require('discord.js');
module.exports = {
	name: 'delete',
	description: 'Delete a ticket',
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
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
		if (message.channel.name.includes('ticket-')) return message.reply('This ticket needs to be closed first!');
		if (srvconfig.ticketlogchannel != 'false') {
			const trans = await message.channel.send('Creating transcript...');
			const messages = await message.channel.messages.fetch({ limit: 100 });
			const logs = [];
			await messages.forEach(async msg => {
				const time = new Date(msg.createdTimestamp).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
				logs.push(`[${time}] ${msg.author.tag}\n${msg.content}`);
			});
			logs.reverse();
			const link = await hastebin.createPaste(logs.join('\n\n'), { server: 'https://bin.birdflop.com' });
			const users = [];
			await client.tickets.get(message.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
			const Embed = new Discord.MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Deleted ${message.channel.name}`)
				.addField('**Users in ticket**', users)
				.addField('**Transcript**', `${link}.txt`)
				.addField('**Deleted by**', author);
			await client.channels.cache.get(srvconfig.ticketlogchannel).send(Embed);
			await trans.delete();
			const rn = new Date();
			const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
			console.log(`[${time} INFO]: Created transcript of ${message.channel.name}: ${link}.txt`);
		}
		await client.tickets.delete(message.channel.id);
		await message.channel.delete();
		const rn = new Date();
		const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
		console.log(`[${time} INFO]: Deleted ticket #${message.channel.name}`);
	},
};