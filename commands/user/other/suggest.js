const Discord = require('discord.js');
module.exports = {
	name: 'suggest',
	description: 'Suggest something',
	cooldown: 10,
	args: true,
	usage: '<Suggestion>',
	async execute(message, args, client) {
		let channel = message.guild.channels.cache.find(c => c.name.includes('suggestions'));
		const suggestion = args.join(' ');
		const Embed = new Discord.MessageEmbed()
			.setColor(3447003)
			.setAuthor(message.author.username, message.author.avatarURL())
			.setTitle('Suggestion')
			.setDescription(suggestion);
		if (!channel) channel = message.channel;
		const msg = await channel.send(Embed);
		await msg.react(client.config.yes);
		await msg.react(client.config.no);
	},
};