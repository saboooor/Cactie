const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'remove',
	description: 'Remove someone from a ticket',
	args: true,
	usage: '<User Mention or Id>',
	botperms: 'MANAGE_CHANNELS',
	similarcmds: 'remqueue',
	guildOnly: true,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply(`This is a subticket!\nYou must use this command in ${message.channel.parent}`);
		if (!client.tickets.get(message.channel.id) || !client.tickets.get(message.channel.id).opener) return;
		const srvconfig = await client.getSettings(message.guild.id);
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is closed!' });
		const user = client.users.cache.find(u => u.id === args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply('Invalid User!');
		if (!client.tickets.get(message.channel.id).users.includes(user.id)) return message.reply({ content: 'This user isn\'t in this ticket!' });
		if (user.id == client.tickets.get(message.channel.id).opener) return message.reply({ content: 'You can\'t remove the ticket opener!' });
		client.tickets.remove(message.channel.id, user.id, 'users');
		if (client.tickets.get(message.channel.id).voiceticket && client.tickets.get(message.channel.id).voiceticket !== 'false') {
			const voiceticket = message.guild.channels.cache.get(client.tickets.get(message.channel.id).voiceticket);
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