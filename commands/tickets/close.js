function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const hastebin = require('hastebin');
const Discord = require('discord.js');
module.exports = {
	name: 'close',
	description: 'Close a ticket',
	async execute(message, user, client, reaction) {
		let author = message.member.user;
		if (reaction) {
			if (message.author.id != client.user.id) return;
			author = user;
		}
		const srvconfig = client.settings.get(message.guild.id);
		if (!client.tickets.get(message.channel.id) || !client.tickets.get(message.channel.id).opener) return;
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		if (message.channel.name.includes(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is already closed!' });
		if (client.tickets.get(message.channel.id).users.includes(author.id)) {
			if (author.id != client.tickets.get(message.channel.id).opener) return message.reply({ content: 'You can\'t close this ticket!' });
		}
		message.channel.setName(message.channel.name.replace('ticket', 'closed'));
		await sleep(1000);
		if (message.channel.name.includes(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'Failed to close ticket, please try again in 10 minutes' });
		client.tickets.set(message.channel.id, 'false', 'resolved');
		client.tickets.get(message.channel.id).users.forEach(userid => {
			message.channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: false });
		});
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
		const EmbedDM = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle(`Closed ${message.channel.name}`)
			.addField('**Users in ticket**', `${users}`)
			.addField('**Transcript**', `${link}.txt`)
			.addField('**Closed by**', `${author}`);
		client.logger.info(`Created transcript of ${message.channel.name}: ${link}.txt`);
		users.forEach(usr => {
			usr.send({ embeds: [EmbedDM] })
				.catch(error => { client.logger.error(error); });
		});
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Closed by ${author}`);
		if (client.settings.get(message.guild.id).tickets == 'buttons') {
			const row = new Discord.MessageActionRow()
				.addComponents([
					new Discord.MessageButton()
						.setCustomId('delete_ticket')
						.setLabel('Delete Ticket')
						.setEmoji('⛔')
						.setStyle('DANGER'),
					new Discord.MessageButton()
						.setCustomId('reopen_ticket')
						.setLabel('Reopen Ticket')
						.setEmoji('🔓')
						.setStyle('PRIMARY'),
				]);
			if (message.type && message.type == 'APPLICATION_COMMAND') message.reply({ embeds: [Embed], components: [row] });
			else message.reply({ embeds: [Embed], components: [row] });
		}
		else {
			message.reply({ embeds: [Embed] });
		}
		if (client.settings.get(message.guild.id).tickets == 'reactions') {
			Embed.setColor(3447003);
			Embed.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
			const embed = await message.channel.send({ embeds: [Embed] });
			embed.react('🔓');
			embed.react('⛔');
		}
		client.logger.info(`Closed ticket #${message.channel.name}`);
	},
};