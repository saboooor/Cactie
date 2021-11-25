const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
	name: 'dm',
	description: 'DM someone through Pup bot.',
	options: require('../options/dm.json'),
	async execute(message, args, client) {
		const member = client.guilds.cache.get('811354612547190794').members.cache.get(message.member.user.id);
		if (!(member ? member.roles.cache.has('849452673156513813') : null)) return;
		const Embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setDescription(`**Message sent to ${client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''))}!**\n**Content:** ${args.slice(1).join(' ')}\nTo see the response, see ${client.channels.cache.get('849453797809455125')}`);
		if (message.attachments && message.attachments.size >= 1 && !message.commandName) {
			const files = [];
			await message.attachments.forEach(async attachment => {
				const response = await fetch(attachment.url, {
					method: 'GET',
				});
				const buffer = await response.buffer();
				const img = new MessageAttachment(buffer, `${attachment.id}.png`);
				files.push(img);
				if (files.length == message.attachments.size) {
					client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''))
						.send({ content: args.slice(1).join(' '), files: files })
						.catch(error => { client.logger.warn(error); });
				}
			});
			return message.reply({ embeds: [Embed] });
		}
		if (!client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''))) return message.reply({ content: 'Invalid user!' });
		client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''))
			.send({ content: args.slice(1).join(' ') })
			.catch(error => { client.logger.warn(error); });
		message.reply({ embeds: [Embed] });
	},
};