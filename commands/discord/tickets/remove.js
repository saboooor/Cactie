const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'remove',
	description: 'Remove someone from a ticket',
	botperm: 'ManageChannels',
	args: true,
	usage: '<User Mention or Id>',
	similarcmds: 'removesong',
	options: require('../../options/user.js'),
	async execute(message, args, client, lang) {
		try {
			// Check if channel is subticket and set the channel to the parent channel
			if (message.channel.isThread()) message.channel = message.channel.parent;

			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket is closed
			if (message.channel.name.startsWith('closed')) return client.error('This ticket is closed!', message, true);

			// Check if user is valid
			const member = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!member) return client.error(lang.invalidmember, message, true);

			// Check if user is already in the ticket, if not, remove them from the ticket data
			if (ticketData.users.includes(member.id)) return client.error('This user has already been added!');
			ticketData.users.remove(member.id);
			client.setData('ticketdata', 'channelId', message.channel.id, 'users', ticketData.users.join(','));

			// If the ticket has a voiceticket, give permissions to the user there
			if (ticketData.voiceticket && ticketData.voiceticket !== 'false') {
				const voiceticket = message.guild.channels.cache.get(ticketData.voiceticket);
				voiceticket.permissionOverwrites.edit(member, { ViewChannel: false });
			}

			// Give permissions to the user and reply
			message.channel.permissionOverwrites.edit(member, { ViewChannel: false });
			const AddEmbed = new EmbedBuilder()
				.setColor(0xFF6400)
				.setDescription(`${message.member.user} remove ${member} from the ticket`);
			message.reply({ embeds: [AddEmbed] });
			client.logger.info(`Removed ${member.user.tag} from #${message.channel.name}`);
		}
		catch (err) { client.error(err, message); }
	},
};