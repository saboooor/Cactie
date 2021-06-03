const Discord = require('discord.js');
module.exports = {
	name: 'dm',
	description: 'DM someone through Pup bot.',
	options: [{
		type: 6,
		name: 'user',
		description: 'User to DM',
		required: true,
	},
	{
		type: 3,
		name: 'message',
		description: 'Message to send',
		required: true,
	}],
	async execute(message, args, client) {
		if (message.commandName) args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		if (message.guild.id == '661736128373719141' && !client.guilds.cache.get('661736128373719141').members.cache.get(message.member.user.id).roles.cache.has('699724468469366844')) return;
		else if (message.member.user.id !== '249638347306303499') return;
		client.users.cache.get(args[0]).send(args[1]);
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setDescription(`**Message sent to ${client.users.cache.get(args[0])}!**\n**Content:** ${args[1]}\nTo see the response, see ${client.channels.cache.get('776992487537377311')}`);
		message.reply(Embed);
	},
};