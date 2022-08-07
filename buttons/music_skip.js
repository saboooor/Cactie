const { EmbedBuilder } = require('discord.js');
const { skip } = require('../lang/int/emoji.json');
const compressEmbed = require('../functions/compressEmbed');

module.exports = {
	name: 'music_skip',
	player: true,
	playing: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	async execute(interaction, client, lang) {
		try {
			// Get the player
			const player = client.manager.get(interaction.guild.id);

			// Check if djrole is set, if so, vote for skip instead of skipping
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			if (srvconfig.djrole != 'false') return;

			if (parseInt(interaction.values[0])) player.queue.remove(0, interaction.values[0]);

			await player.stop();
			const song = player.queue.current;
			const SkipEmbed = new EmbedBuilder()
				.setDescription(`<:skip:${skip}> **${lang.music.track.skipped}**\n[${song.title}](${song.uri})`)
				.setColor(song.colors[0])
				.setThumbnail(song.img)
				.setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
			const skipmsg = await interaction.channel.send({ embeds: [SkipEmbed] });

			// After 10 seconds, compress message
			await sleep(10000);
			skipmsg.edit({ embeds: [compressEmbed(SkipEmbed)] });
		}
		catch (err) { client.error(err, interaction); }
	},
};