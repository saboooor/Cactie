function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const Discord = require('discord.js');
module.exports = {
	name: 'boner',
	description: 'See your pp grow!',
	aliases: ['pp', 'penis', 'erect'],
	cooldown: 10,
	options: [{
		type: 3,
		name: 'someone',
		description: 'Pick someone for the bot to calculate the pp size of',
	}],
	async execute(message, args, client) {
		if (client.settings.get(message.guild.id).bonercmd == 'false') return message.reply('This command is disabled!');
		if (message.commandName) args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		const srvconfig = client.settings.get(message.guild.id);
		const random = Math.round(Math.random() * srvconfig.maxppsize);
		let nick = message.member.displayName;
		if (args[0]) {
			nick = args[0];
			if (nick.startsWith('<@') && nick.endsWith('>')) {
				let mention = nick.slice(2, -1);
				if (mention.startsWith('!')) mention = mention.slice(1);
				nick = client.users.cache.get(mention).username;
			}
		}
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`${nick}'s pp size`)
			.setDescription('<a:loading:826611946258038805> Calculating...');
		const pp = await message.reply(Embed);
		const shaft = [];
		for (let step = 0; step < random; step++) {
			await sleep(1200);
			Embed.setDescription('8' + shaft.join('') + 'D');
			if (!message.commandName) pp.edit(Embed);
			else message.editReply(Embed);
			shaft.push('=');
		}
		const sike = Math.round(Math.random() * 10);
		if (sike == 5) {
			Embed.setDescription('SIKE').setFooter(`${nick} has no pp`);
			if (!message.commandName) pp.edit(Embed);
			else message.editReply(Embed);
			return;
		}
		Embed.setFooter(`pp size = ${random}"`);
		if (!message.commandName) pp.edit(Embed);
		else message.editReply(Embed);
	},
};