const Discord = require('discord.js');
module.exports = {
	name: 'instaboner',
	description: 'See your pp grow FAST!',
	aliases: ['instapp'],
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
		let nick = message.member.displayName;
		if (args[0]) {
			nick = args[0];
			if (nick.startsWith('<@') && nick.endsWith('>')) {
				let mention = nick.slice(2, -1);
				if (mention.startsWith('!')) mention = mention.slice(1);
				nick = client.users.cache.get(mention).username;
			}
		}
		const hard = Math.round(Math.random());
		let hardtxt = 'soft';
		if (hard == '1') hardtxt = 'hard';
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`${nick}'s ${hardtxt} pp size`);
		if (Math.round(Math.random() * 10) == 5) {
			Embed.setDescription('SIKE').setFooter(`${nick} has no pp`);
			message.reply(Embed);
			return;
		}
		const random = Math.round(Math.random() * srvconfig.maxppsize);
		Embed.setDescription('8' + '='.repeat(random - 1) + 'D').setFooter(`${hardtxt} pp size = ${random}"`);
		message.reply(Embed);
	},
};