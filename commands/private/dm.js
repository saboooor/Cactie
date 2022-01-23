const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
module.exports = {
	name: 'dm',
	description: 'DM someone through Pup bot.',
	async execute(message, args, client) {
		const member = client.guilds.cache.get('811354612547190794').members.cache.get(message.member.user.id);
		if (member ? !member.roles.cache.has('849452673156513813') : true) return;
		if (!client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''))) return message.reply({ content: 'Invalid user!' });
		const Embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setDescription(`**Message sent to ${client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''))}!**\n**Content:** ${args.slice(1).join(' ')}`);
		const files = [];
		for (const attachment of message.attachments) {
			const response = await fetch(attachment[1].url, { method: 'GET' });
			const arrayBuffer = await response.arrayBuffer();
			const img = new MessageAttachment(Buffer.from(arrayBuffer), attachment[1].name);
			files.push(img);
		}
		client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''))
			.send({ content: args.slice(1).join(' '), files: files })
			.catch(error => { client.logger.warn(error); });
		message.reply({ embeds: [Embed] });
	},
};