function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
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
		if (srvconfig.tickets == 'false') return message.reply('Tickets are disabled!');
		if (!message.channel.topic) return message.reply('This is not a valid ticket!');
		if (!message.channel.topic.includes('Ticket Opened by')) return message.reply('This is not a valid ticket!');
		if (message.channel.name.includes(`closed${client.user.username.replace('Pup ', '').toLowerCase()}-`)) return message.reply('This ticket is already closed!');
		if (client.tickets.get(message.channel.id).users.includes(author.id)) {
			if (author.id != client.tickets.get(message.channel.id).opener) return message.reply('You can\'t close this ticket!');
		}
		message.channel.setName(message.channel.name.replace('ticket', 'closed'));
		await sleep(1000);
		if (message.channel.name.includes(`ticket${client.user.username.replace('Pup ', '').toLowerCase()}-`)) return message.reply('Failed to close ticket, please try again in 10 minutes');
		client.tickets.set(message.channel.id, 'false', 'resolved');
		client.tickets.get(message.channel.id).users.forEach(userid => {
			message.channel.updateOverwrite(client.users.cache.get(userid), { VIEW_CHANNEL: false });
		});
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Closed by ${author}`);
		if (client.settings.get(message.guild.id).tickets == 'buttons') {
			const row = new Discord.MessageActionRow()
				.addComponents([
					new Discord.MessageButton()
						.setCustomID('delete_ticket')
						.setLabel('Delete Ticket')
						.setEmoji('⛔')
						.setStyle('DANGER'),
					new Discord.MessageButton()
						.setCustomID('reopen_ticket')
						.setLabel('Reopen Ticket')
						.setEmoji('🔓')
						.setStyle('PRIMARY'),
				]);
			if (message.type && message.type == 'APPLICATION_COMMAND') message.reply({ embeds: [Embed], components: [row] });
			else message.reply({ embed: Embed, components: [row] });
		}
		else {
			message.reply(Embed);
		}
		if (client.settings.get(message.guild.id).tickets == 'reactions') {
			Embed.setColor(3447003);
			Embed.setDescription(`🔓 Reopen Ticket \`${srvconfig.prefix}open\` \`/open\`\n⛔ Delete Ticket \`${srvconfig.prefix}delete\` \`/delete\``);
			const embed = await message.channel.send(Embed);
			embed.react('🔓');
			embed.react('⛔');
		}
		client.logger.info(`Closed ticket #${message.channel.name}`);
	},
};