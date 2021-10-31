function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'boner',
	description: 'See your boner expand!',
	usage: '[Someone]',
	aliases: ['pp'],
	cooldown: 10,
	options: require('../options/someone.json'),
	async execute(message, args, client) {
		// Get settings and check if bonercmd is enabled
		const srvconfig = message.guild ? client.settings.get(message.guild.id) : { bonercmd: 'true', maxppsize: '35' };
		if (srvconfig.bonercmd == 'false') return message.reply({ content: 'This command is disabled!' });

		// Get random number out of the maxppsize for the amount of inches
		const random = Math.round(Math.random() * srvconfig.maxppsize);

		// Get name of author, or user if specified
		const name = message.guild ? message.member.displayName : message.user.username;
		let nick = args[0] ? args[0] : name;

		// Check if arg is set and is a mention and fetch that user for the name
		if (args[0] && nick.startsWith('<@') && nick.endsWith('>')) {
			const mention = nick.includes('!') ? nick.slice(3, -1) : nick.slice(2, -1);
			nick = client.users.cache.get(mention).username;
		}

		// Create initial embed and reply with it
		const Embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`${nick}'s pp size`)
			.setDescription('<a:loading:826611946258038805> Calculating...');
		const pp = await message.reply({ embeds: [Embed] });

		// For pushing equals signs
		const shaft = [];

		// Add equal signs to shaft every second and edit the message
		for (let step = 0; step < random; step++) {
			await sleep(1200);
			Embed.setDescription('8' + shaft.join('') + 'D');
			message.commandName ? message.editReply({ embeds: [Embed] }) : pp.edit({ embeds: [Embed] });
			shaft.push('=');
		}

		// Chance of getting a SIKE u have no pp
		if (Math.round(Math.random() * 10) == 5) {
			Embed.setDescription('SIKE').setFooter(`${nick} has no pp`);
			return message.commandName ? message.editReply({ embeds: [Embed] }) : pp.edit({ embeds: [Embed] });
		}

		// Set pp size inches to footer and edit message to final result
		Embed.setFooter(`pp size = ${random}"`);
		message.commandName ? message.editReply({ embeds: [Embed] }) : pp.edit({ embeds: [Embed] });
	},
};