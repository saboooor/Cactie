const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'bonk',
	description: 'Bonk someone!',
	usage: '[Someone]',
	options: require('../options/someone.json'),
	async execute(message, args, client) {
		// Create embed with bonk gif and author / footer
		const Embed = new MessageEmbed()
			.setAuthor(`${message.guild ? message.member.displayName : message.user.username} bonks ${args[0] ? args.join(' ') : 'themselves'}`, message.member.user.avatarURL())
			.setImage('https://c.tenor.com/TbLpG9NCzjkAAAAC/bonk.gif')
			.setFooter('get bonked');

		// Check if arg is a user
		let user = null;
		if (args[0] && client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''))) {
			user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
			args[0] = user.username;
		}

		// Reply with bonk message, if user is set then mention the user
		message.reply({ content: user ? `${user}` : null, embeds: [Embed] });
	},
};