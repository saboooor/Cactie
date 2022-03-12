const { Embed } = require('discord.js');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'remove',
	description: 'Remove someone from a ticket',
	botperm: 'ManageChannels',
	args: true,
	usage: '<User Mention or Id>',
	similarcmds: 'remqueue',
	options: require('../options/user.json'),
	async execute(message, args, client) {
		try {
			// Check if channel is a subticket, if so tell the user to use the command in the ticket itself instead
			if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: `This is a subticket!\nYou must use this command in ${message.channel.parent}` });

			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Get settings and check if tickets are disabled
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });

			// Check if ticket is closed
			if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is closed!' });

			// Check if user is valid
			const member = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!member) return client.error(msg.invalidmember, message, true);

			// Check if user is already in the ticket, if not, remove them from the ticket data
			if (ticketData.users.includes(member.id)) return message.reply({ content: 'This user has already been added!' });
			ticketData.users.remove(member.id);
			client.setData('ticketdata', 'channelId', message.channel.id, 'users', ticketData.users.join(','));

			// If the ticket has a voiceticket, give permissions to the user there
			if (ticketData.voiceticket && ticketData.voiceticket !== 'false') {
				const voiceticket = message.guild.channels.cache.get(ticketData.voiceticket);
				voiceticket.permissionOverwrites.edit(member, { ViewChannel: false });
			}

			// Give permissions to the user and reply
			message.channel.permissionOverwrites.edit(member, { ViewChannel: false });
			const AddEmbed = new Embed()
				.setColor(0xFF6400)
				.setDescription(`${message.member.user} remove ${member} from the ticket`);
			message.reply({ embeds: [AddEmbed] });
			client.logger.info(`Removed ${member.user.tag} from #${message.channel.name}`);
		}
		catch (err) { client.error(err, message); }
	},
};