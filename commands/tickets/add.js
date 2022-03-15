const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'add',
	description: 'Add someone to a ticket',
	botperm: 'MANAGE_CHANNELS',
	args: true,
	usage: '<User Mention or Id>',
	options: require('../options/user.json'),
	async execute(message, args, client) {
		try {
			// Check if channel is a subticket, if so tell the user to use the command in the ticket itself instead
			if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Cactie', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Cactie', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: `This is a subticket!\nYou must use this command in ${message.channel.parent}` });

			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Get settings and check if tickets are disabled
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });

			// Check if ticket is closed
			if (message.channel.name.startsWith(`closed${client.user.username.replace('Cactie', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is closed!' });

			// Check if user is valid
			const user = client.users.cache.find(u => u.id === args[0].replace(/\D/g, ''));
			if (!user) return message.reply({ content: 'Invalid User!' });

			// Check if user is already in the ticket, if not, add them to the ticket data
			if (ticketData.users.includes(user.id)) return message.reply({ content: 'This user has already been added!' });
			ticketData.users.push(user.id);
			client.setData('ticketdata', 'channelId', message.channel.id, 'users', ticketData.users.join(','));

			// If the ticket has a voiceticket, give permissions to the user there
			if (ticketData.voiceticket && ticketData.voiceticket !== 'false') {
				const voiceticket = message.guild.channels.cache.get(ticketData.voiceticket);
				voiceticket.permissionOverwrites.edit(user, { VIEW_CHANNEL: true });
			}

			// Give permissions to the user and reply
			message.channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: true });
			const Embed = new MessageEmbed()
				.setColor(15105570)
				.setDescription(`${message.member.user} added ${user} to the ticket`);
			message.reply({ embeds: [Embed] });
			client.logger.info(`Added ${user.username} to #${message.channel.name}`);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};