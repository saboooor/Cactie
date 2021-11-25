function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
const { jump } = require('../../config/emoji.json');
module.exports = {
	name: 'skipto',
	aliases: ['jump'],
	description: 'Skip to a song in queue',
	args: true,
	usage: '<Index of song in queue>',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	options: require('../options/index.json'),
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		if (message.guild.me.voice.serverMute) return message.reply({ content: 'I\'m server muted!' });
		const position = Number(args[0]);
		if (!position || position < 0 || position > player.queue.size) {
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`Usage: ${srvconfig.prefix}skipto <Number of song in queue>`);
			return message.reply({ embeds: [thing] });
		}
		player.queue.remove(0, position - 1);
		player.stop();
		const thing = new MessageEmbed()
			.setDescription(`${jump} Skipped **${position}** Songs`)
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp();
		const msg = await message.reply({ embeds: [thing] });
		await sleep(10000);
		msg.delete();
	},
};