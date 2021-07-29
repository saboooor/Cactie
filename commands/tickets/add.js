const Discord = require('discord.js');
module.exports = {
	name: 'add',
	description: 'Add someone to a ticket.',
	args: true,
	usage: '<User Mention or Id>',
	guildOnly: true,
	options: [{
		type: 6,
		name: 'user',
		description: 'User to add to ticket',
		required: true,
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply(`This is a subticket!\nYou must use this command in ${message.channel.parent}`);
		if (!client.tickets.get(message.channel.id) || !client.tickets.get(message.channel.id).opener) return;
		if (client.settings.get(message.guild.id).tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is closed!' });
		const user = client.users.cache.find(u => u.id === args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply('Invalid User!');
		if (client.tickets.get(message.channel.id).users.includes(user.id)) return message.reply({ content: 'This user has already been added!' });
		client.tickets.push(message.channel.id, user.id, 'users');
		if (client.tickets.get(message.channel.id).voiceticket && client.tickets.get(message.channel.id).voiceticket !== 'false') {
			const voiceticket = message.guild.channels.cache.get(client.tickets.get(message.channel.id).voiceticket);
			voiceticket.permissionOverwrites.edit(user, { VIEW_CHANNEL: true });
		}
		message.channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: true });
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`${message.member.user} added ${user} to the ticket`);
		message.reply({ embeds: [Embed] });
		client.logger.info(`Added ${user.username} to #${message.channel.name}`);
	},
};