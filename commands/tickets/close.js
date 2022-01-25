function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'close',
	description: 'Close a ticket',
	botperm: 'MANAGE_CHANNELS',
	async execute(message, user, client, reaction) {
		// Set author to reaction author if the command is a reaction
		let author = message.member.user;
		if (reaction) {
			if (message.author.id != client.user.id) return;
			author = user;
		}

		// Check if ticket is an actual ticket
		const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
		if (!ticketData) return;

		// Split the list of users into an array cuz mysql dumb
		if (ticketData.users) ticketData.users = ticketData.users.split(',');
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

		// If the channel is a subticket, delete the subticket instead
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

		// Check if tickets are disabled
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		
		// Check if ticket is already closed
		if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is already closed!' });
		
		// Check if user is a user that has been added with -add
		if (ticketData.users.includes(author.id) && author.id != ticketData.opener) return message.reply({ content: 'You can\'t close this ticket!' });
		
		// Set the name to closed and check if bot has been rate limited
		message.channel.setName(message.channel.name.replace('ticket', 'closed'));
		await sleep(1000);
		if (message.channel.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'Failed to close ticket, please try again in 10 minutes' });
		
		// If voiceticket is set, delete the voiceticket
		if (ticketData.voiceticket !== 'false') {
			const voiceticket = message.guild.channels.cache.get(ticketData.voiceticket);
			voiceticket.delete();
			await client.setData('ticketdata', 'channelId', message.channel.id, 'voiceticket', 'false');
		}

		// Unresolve ticket
		await client.setData('ticketdata', 'channelId', message.channel.id, 'resolved', 'false');
		
		// Get rid of the permissions of the users in the tickets from the ticket itself
		ticketData.users.forEach(userid => {
			message.channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: false });
		});

		// Create a transcript of the ticket
		const messages = await message.channel.messages.fetch({ limit: 100 });
		const link = await getTranscript(messages);

		// Get all the users and send the embed to their DMs
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

		// Create embed
		const Embed = new MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Closed by ${author}`);

		// If the ticket mode is set to buttons, add the buttons, if not, don't
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

		// Add reaction panel if ticket mode is set to reactions
		if (srvconfig.tickets == 'reactions') {
			Embed.setColor(3447003);
			Embed.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
			const embed = await message.channel.send({ embeds: [Embed] });
			embed.react('🔓');
			embed.react('⛔');
		}

		// Log
		client.logger.info(`Closed ticket #${message.channel.name}`);
	},
};