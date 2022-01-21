const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'remove',
	description: 'Remove someone from a ticket',
	args: true,
	usage: '<User Mention or Id>',
	botperm: 'MANAGE_CHANNELS',
	similarcmds: 'remqueue',
	options: require('../options/user.json'),
	async execute(message, args, client) {
		if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply(`This is a subticket!\nYou must use this command in ${message.channel.parent}`);
		// Check if ticket is an actual ticket
		const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
		if (!ticketData) return;
		if (ticketData.users) ticketData.users = ticketData.users.split(',');
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is closed!' });
		const user = client.users.cache.find(u => u.id === args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply('Invalid User!');
		if (!ticketData.users.includes(user.id)) return message.reply({ content: 'This user isn\'t in this ticket!' });
		if (user.id == ticketData.opener) return message.reply({ content: 'You can\'t remove the ticket opener!' });
		ticketData.users.remove(user.id);
		client.setData('ticketdata', 'channelId', message.channel.id, 'users', ticketData.users.join(','));
		if (ticketData.voiceticket && ticketData.voiceticket !== 'false') {
			const voiceticket = message.guild.channels.cache.get(ticketData.voiceticket);
			voiceticket.permissionOverwrites.edit(user, { VIEW_CHANNEL: false });
		}
		message.channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: false });
		const Embed = new MessageEmbed()
			.setColor(15105570)
			.setDescription(`${message.member.user} removed ${user} from the ticket`);
		message.reply({ embeds: [Embed] });
		client.logger.info(`Removed ${user.username} from #${message.channel.name}`);
	},
};