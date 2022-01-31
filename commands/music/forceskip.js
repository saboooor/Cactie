function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
const msg = require('../../lang/en/msg.json');
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
		try {
			// Get player
			const player = client.manager.get(message.guild.id);

			// Skip the song and reply with song that was skipped
			player.stop();
			const song = player.queue.current;
			const thing = new MessageEmbed()
				.setDescription(`${msg.music.skip.skipped}\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setTimestamp()
				.setThumbnail(song.img);
			const skipmsg = await message.reply({ embeds: [thing] });

			// Wait 10 seconds and compress the message
			await sleep(10000);
			message.commandName ? message.deleteReply() : skipmsg.edit({ content: msg.music.skip.skipped, embeds: [] });
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};