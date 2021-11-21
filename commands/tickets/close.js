function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'close',
	description: 'Close a ticket',
	guildOnly: true,
	botperms: 'MANAGE_CHANNELS',
	async execute(message, user, client, reaction) {
		let author = message.member.user;
		if (reaction) {
			if (message.author.id != client.user.id) return;
			author = user;
		}
		const srvconfig = await client.getSettings(message.guild.id);
		if (!client.tickets.get(message.channel.id)) return message.reply('An error occured, please manually delete this channel.');
		if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) &&
		message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) {
			const messages = await message.channel.messages.fetch({ limit: 100 });
			const link = await getTranscript(messages);
			const Embed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Closed ${message.channel.name}`)
				.addField('**Transcript**', `${link}.txt`)
				.addField('**Closed by**', `${message.member.user}`);
			client.logger.info(`Created transcript of ${message.channel.name}: ${link}.txt`);
			message.channel.parent.send({ embeds: [Embed] })
				.catch(error => { client.logger.error(error); });
			client.logger.info(`Closed subticket #${message.channel.name}`);
			return message.channel.delete();
		}
		if (!client.tickets.get(message.channel.id) || !client.tickets.get(message.channel.id).opener) return;
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is already closed!' });
		if (client.tickets.get(message.channel.id).users.includes(author.id)) {
			if (author.id != client.tickets.get(message.channel.id).opener) return message.reply({ content: 'You can\'t close this ticket!' });
		}
		message.channel.setName(message.channel.name.replace('ticket', 'closed'));
		await sleep(1000);
		if (message.channel.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'Failed to close ticket, please try again in 10 minutes' });
		if (client.tickets.get(message.channel.id).voiceticket && client.tickets.get(message.channel.id).voiceticket !== 'false') {
			const voiceticket = message.guild.channels.cache.get(client.tickets.get(message.channel.id).voiceticket);
			voiceticket.delete();
			client.tickets.set(message.channel.id, 'false', 'voiceticket');
		}
		client.tickets.set(message.channel.id, 'false', 'resolved');
		client.tickets.get(message.channel.id).users.forEach(userid => {
			message.channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: false });
		});
		const messages = await message.channel.messages.fetch({ limit: 100 });
		const link = await getTranscript(messages);
		const users = [];
		await client.tickets.get(message.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
		const EmbedDM = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle(`Closed ${message.channel.name}`)
			.addField('**Users in ticket**', `${users}`)
			.addField('**Transcript**', `${link}.txt`)
			.addField('**Closed by**', `${author}`);
		client.logger.info(`Created transcript of ${message.channel.name}: ${link}.txt`);
		users.forEach(usr => {
			usr.send({ embeds: [EmbedDM] })
				.catch(error => { client.logger.warn(error); });
		});
		const Embed = new MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Closed by ${author}`);
		if (await client.getSettings(message.guild.id).tickets == 'buttons') {
			const row = new MessageActionRow()
				.addComponents([
					new MessageButton()
						.setCustomId('delete_ticket')
						.setLabel('Delete Ticket')
						.setEmoji('⛔')
						.setStyle('DANGER'),
					new MessageButton()
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
		if (await client.getSettings(message.guild.id).tickets == 'reactions') {
			Embed.setColor(3447003);
			Embed.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
			const embed = await message.channel.send({ embeds: [Embed] });
			embed.react('🔓');
			embed.react('⛔');
		}
		client.logger.info(`Closed ticket #${message.channel.name}`);
	},
};