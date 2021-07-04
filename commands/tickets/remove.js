const Discord = require('discord.js');
module.exports = {
	name: 'remove',
	description: 'Remove someone from a ticket.',
	args: true,
	usage: '<User Mention or ID>',
	guildOnly: true,
	options: [{
		type: 6,
		name: 'user',
		description: 'User to add to ticket',
		required: true,
	}],
	async execute(message, args, client, Client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		if (!client.tickets.get(message.channel.id) || !client.tickets.get(message.channel.id).opener) return;
		if (client.settings.get(message.guild.id).tickets == 'false') return message.reply('Tickets are disabled!');
		if (message.channel.name.includes(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply('This ticket is closed!');
		const user = client.users.cache.find(u => u.id === args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!client.tickets.get(message.channel.id).users.includes(user.id)) return message.reply('This user isn\'t in this ticket!');
		if (user.id == client.tickets.get(message.channel.id).opener) return message.reply('You can\'t remove the ticket opener!');
		client.tickets.remove(message.channel.id, user.id, 'users');
		message.channel.updateOverwrite(user, { VIEW_CHANNEL: false });
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`${message.member.user} removed ${user} from the ticket`);
		message.reply(Embed);
		client.logger.info(`Removed ${user.username} from #${message.channel.name}`);
	},
};