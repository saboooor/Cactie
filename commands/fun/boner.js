function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'boner',
	description: 'See your boner expand!',
	usage: '[Someone]',
	aliases: ['pp'],
	cooldown: 10,
	options: require('./someone.json'),
	async execute(message, args, client) {
		if (client.settings.get(message.guild.id).bonercmd == 'false') return message.reply({ content: 'This command is disabled!' });
		const srvconfig = client.settings.get(message.guild.id);
		const random = Math.round(Math.random() * srvconfig.maxppsize);
		let nick = args[0] ? args[0] : message.member.displayName;
		if (args[0] && nick.startsWith('<@') && nick.endsWith('>')) {
			const mention = nick.includes('!') ? nick.slice(3, -1) : nick.slice(2, -1);
			nick = client.users.cache.get(mention).username;
		}
		const Embed = new MessageEmbed()
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