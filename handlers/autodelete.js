const cron = require('node-cron');
const Discord = require('discord.js');
function sleep(ms) {
	return new Promise(res => setTimeout(res, ms));
}
function minTwoDigits(n) {
	return (n < 10 ? '0' : '') + n;
}
module.exports = client => {
	cron.schedule('0 0 * * *', () => {
		client.channels.cache.forEach(async channel => {
			if (client.tickets.get(channel.id).resolved == 'true' && channel.name.includes('ticket-')) {
				channel.setName(channel.name.replace('ticket', 'closed'));
				await sleep(1000);
				if (channel.name.includes('ticket-')) return channel.send('Failed to close ticket, please try again in 10 minutes');
				client.tickets.set(channel.id, 'false', 'resolved');
				client.tickets.get(channel.id).users.forEach(userid => channel.updateOverwrite(client.users.cache.get(userid), { VIEW_CHANNEL: false }));
				const Embed = new Discord.MessageEmbed()
					.setColor(15105570)
					.setDescription('Ticket Closed automatically');
				channel.send(Embed);
				Embed.setColor(3447003).setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
				const msg = await channel.send(Embed);
				msg.react('🔓');
				msg.react('⛔');
				const rn = new Date();
				const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
				console.log(`[${time} INFO]: Closed resolved ticket #${channel.name}`);
			}
		});
	});
};