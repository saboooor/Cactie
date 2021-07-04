const Discord = require('discord.js');
module.exports = {
	name: 'add',
	description: 'Add someone to a ticket.',
	args: true,
	usage: '<User Mention or ID>',
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
		if (!client.tickets.get(message.channel.id) || !client.tickets.get(message.channel.id).opener) return;
		if (client.settings.get(message.guild.id).tickets == 'false') return message.reply('Tickets are disabled!');
		if (message.channel.name.includes(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply('This ticket is closed!');
		const user = client.users.cache.find(u => u.id === args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (client.tickets.get(message.channel.id).users.includes(user.id)) return message.reply('This user has already been added!');
		client.tickets.push(message.channel.id, user.id, 'users');
		message.channel.updateOverwrite(user, { VIEW_CHANNEL: true });
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`${message.member.user} added ${user} to the ticket`);
		message.reply(Embed);
		client.logger.info(`Added ${user.username} to #${message.channel.name}`);
	},
};