function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
const { skip } = require('../../config/emoji.json');
module.exports = {
	name: 'forceskip',
	aliases: ['fs'],
	description: 'Force skip the currently playing song',
	player: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		// Get player
		const player = client.manager.get(message.guild.id);

		// Skip the song and reply with song that was skipped
		player.stop();
		const song = player.queue.current;
		const thing = new MessageEmbed()
			.setDescription(`${skip} **Force Skipped**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(song.img);
		const msg = await message.reply({ embeds: [thing] });

		// Wait 10 seconds and compress the message
		await sleep(10000);
		message.commandName ? message.deleteReply() : msg.edit({ content: '**Skipped**', embeds: [] });
	},
};