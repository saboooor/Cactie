const Discord = require('discord.js');
const fetch = require('node-fetch');
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
		if (!client.guilds.cache.get('811354612547190794').members.cache.get(message.member.user.id).roles.cache.has('849452673156513813')) return;
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setDescription(`**Message sent to ${client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''))}!**\n**Content:** ${args.join(' ').replace(args[0], '')}\nTo see the response, see ${client.channels.cache.get('849453797809455125')}`);
		if (message.attachments.size == 1 && !message.commandName) {
			const picture = message.attachments.first();
			const attachmenturl = picture.attachment;
			const response = await fetch(attachmenturl, {
				method: 'GET',
			});
			const buffer = await response.buffer();
			client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', '')).send(args.join(' ').replace(args[0], ''), new Discord.MessageAttachment(buffer, 'image.png'));
			return message.reply(Embed);
		}
		client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', '')).send(args.join(' ').replace(args[0], ''));
		message.reply(Embed);
	},
};