function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'open',
	description: 'Repen a ticket',
	aliases: ['reopen'],
	botperm: 'ManageChannels',
	async execute(message, user, client, lang, reaction) {
		try {
			// Set author to command sender
			let author = message.member.user;

			// If this command is being used as a reaction:
			// return if the message isn't a ticket panel
			// set author to args, which is the reaction user
			if (reaction) {
				if (message.author.id != client.user.id) return;
				author = user;
			}

			// Check if channel is subticket and set the channel to the parent channel
			if (message.channel.isThread()) message.channel = message.channel.parent;

			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket is already opened
			if (message.channel.name.startsWith('ticket')) return client.error('This ticket is already opened!', message, true);

			// Set the name to closed and check if bot has been rate limited
			await message.channel.setName(message.channel.name.replace('closed', 'ticket'));
			await sleep(1000);
			if (message.channel.name.startsWith('closed')) return client.error('Failed to open ticket, please try again in 10 minutes', message, true);

			// Add permissions to the users in the ticket to view the ticket
			await ticketData.users.forEach(userid => message.channel.permissionOverwrites.edit(userid, { ViewChannel: true }));

			// Reply with ticket open message
			const OpenEmbed = new EmbedBuilder()
				.setColor(0xFF6400)
				.setDescription(`Ticket Opened by ${author}`);
			message.reply({ embeds: [OpenEmbed] });
			client.logger.info(`Reopened ticket #${message.channel.name}`);
		}
		catch (err) { client.error(err, message); }
	},
};