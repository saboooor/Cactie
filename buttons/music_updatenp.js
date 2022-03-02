function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { convertTime } = require('../functions/music/convert.js');
const { progressbar } = require('../functions/music/progressbar.js');
const msg = require('../lang/en/msg.json');
module.exports = {
	name: 'music_updatenp',
	player: true,
	serverUnmute: true,
	async execute(interaction, client) {
		try {
			// Get player, current song, and song position / length
			const player = client.manager.get(interaction.guild.id);
			const song = player.queue.current;
			const total = song.duration;
			const current = player.position;

			// Create embed and disable button
			const embed = new MessageEmbed()
				.setDescription(`${msg.music.np}\n[${song.title}](${song.uri})\n\`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]\n\`${progressbar(total, current, 20, '▬', '🔘')}\`\n\`${convertTime(current)} / ${convertTime(total).replace('7:12:56', 'LIVE')}\``)
				.setThumbnail(song.img)
				.setColor(song.color);
			const btn = new MessageButton()
				.setCustomId('music_updatenp')
				.setLabel('Update')
				.setStyle('SECONDARY')
				.setDisabled(true);
			const row = new MessageActionRow().addComponents(btn);

			// Send updated embed with disabled button and re-enable it after 5 seconds
			await interaction.reply({ embeds: [embed], components: [row] });
			await sleep(5000);
			btn.setDisabled(false);
			await interaction.reply({ embeds: [embed], components: [row] });
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};