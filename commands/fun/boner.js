function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const Discord = require('discord.js');
module.exports = {
	name: 'boner',
	description: 'See your pp grow!',
	usage: '[Someone]',
	aliases: ['pp'],
	cooldown: 10,
	options: [{
		type: 3,
		name: 'someone',
		description: 'Pick someone for the bot to calculate the pp size of',
	}],
	async execute(message, args, client) {
		if (client.settings.get(message.guild.id).bonercmd == 'false') return message.reply('This command is disabled!');
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		const srvconfig = client.settings.get(message.guild.id);
		const random = Math.round(Math.random() * srvconfig.maxppsize);
		let nick = args[0] ? args[0] : message.member.displayName;
		if (args[0] && nick.startsWith('<@') && nick.endsWith('>')) {
			const mention = nick.includes('!') ? nick.slice(3, -1) : nick.slice(2, -1);
			nick = client.users.cache.get(mention).username;
		}
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`${nick}'s pp size`)
			.setDescription('<a:loading:826611946258038805> Calculating...');
		const pp = await message.reply({ embeds: [Embed] });
		const shaft = [];
		for (let step = 0; step < random; step++) {
			await sleep(1200);
			Embed.setDescription('8' + shaft.join('') + 'D');
			message.commandName ? message.editReply({ embeds: [Embed] }) : pp.edit({ embeds: [Embed] });
			shaft.push('=');
		}
		if (Math.round(Math.random() * 10) == 5) {
			Embed.setDescription('SIKE').setFooter(`${nick} has no pp`);
			return message.commandName ? message.editReply({ embeds: [Embed] }) : pp.edit({ embeds: [Embed] });
		}
		Embed.setFooter(`pp size = ${random}"`);
		message.commandName ? message.editReply({ embeds: [Embed] }) : pp.edit({ embeds: [Embed] });
	},
};