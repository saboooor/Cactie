function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
const { skip } = require('../../config/emoji.json');
module.exports = {
	name: 'forceskip',
	aliases: ['fs'],
	description: 'Force skip the currently playing song',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		if (message.guild.me.voice.serverMute) return message.reply({ content: 'I\'m server muted!' });
		const autoplay = player.get('autoplay');
		const song = player.queue.current;
		if (autoplay === false) {
			player.stop();
		}
		else {
			player.stop();
			player.queue.clear();
			player.set('autoplay', false);
		}
		const thing = new MessageEmbed()
			.setDescription(`${skip} **Force Skipped**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(song.img);
		const msg = await message.reply({ embeds: [thing] });
		await sleep(10000);
		message.commandName ? message.deleteReply() : msg.edit({ content: '**Skipped**', embeds: [] });
	},
};