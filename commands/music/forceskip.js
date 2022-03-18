function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
const compressEmbed = require('../../functions/compressEmbed');
const { skip } = require('../../lang/int/emoji.json');
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
			const SkipEmbed = new EmbedBuilder()
				.setDescription(`<:skip:${skip}> **${message.lang.music.skip.skipped}**\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setThumbnail(song.img)
				.setFooter({ text: message.member.user.tag, iconURL: message.member.user.displayAvatarURL() });
			const skipmsg = await message.reply({ embeds: [SkipEmbed] });

			// Wait 10 seconds and compress the message
			await sleep(10000);
			message.commandName ? message.editReply({ embeds: [compressEmbed(SkipEmbed)] }) : skipmsg.edit({ embeds: [compressEmbed(SkipEmbed)] });
		}
		catch (err) { client.error(err, message); }
	},
};