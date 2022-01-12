function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'close',
	description: 'Close a ticket',
	botperms: 'MANAGE_CHANNELS',
	async execute(message, user, client, reaction) {
		let author = message.member.user;
		if (reaction) {
			if (message.author.id != client.user.id) return;
			author = user;
		}
		// Check if ticket is an actual ticket
		const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
		if (!ticketData) return;
		if (ticketData.users) ticketData.users = ticketData.users.split(',');
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
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
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is already closed!' });
		if (ticketData.users.includes(author.id) && author.id != ticketData.opener) return message.reply({ content: 'You can\'t close this ticket!' });
		message.channel.setName(message.channel.name.replace('ticket', 'closed'));
		await sleep(1000);
		if (message.channel.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'Failed to close ticket, please try again in 10 minutes' });
		if (ticketData.voiceticket !== 'false') {
			const voiceticket = message.guild.channels.cache.get(ticketData.voiceticket);
			voiceticket.delete();
			await client.setData('ticketdata', 'channelId', message.channel.id, 'voiceticket', 'false');
		}
		await client.setData('ticketdata', 'channelId', message.channel.id, 'resolved', 'false');
		ticketData.users.forEach(userid => {
			message.channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: false });
		});
		const messages = await message.channel.messages.fetch({ limit: 100 });
		const link = await getTranscript(messages);
		const users = [];
		await ticketData.users.forEach(userid => users.push(client.users.cache.get(userid)));
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
		if (srvconfig.tickets == 'buttons') {
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
		if (srvconfig.tickets == 'reactions') {
			Embed.setColor(3447003);
			Embed.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
			const embed = await message.channel.send({ embeds: [Embed] });
			embed.react('🔓');
			embed.react('⛔');
		}
		client.logger.info(`Closed ticket #${message.channel.name}`);
	},
};