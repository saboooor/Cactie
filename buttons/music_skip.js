function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { Embed } = require('discord.js');
const { skip } = require('../lang/int/emoji.json');
const compressEmbed = require('../functions/compressEmbed');
const msg = require('../lang/en/msg.json');
module.exports = {
	name: 'music_skip',
	player: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(interaction, client) {
		try {
			// Get the player
			const player = client.manager.get(interaction.guild.id);

			// Check if djrole is set, if so, vote for skip instead of skipping
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			if (srvconfig.djrole != 'false') {
				const requiredAmount = Math.floor((interaction.guild.me.voice.channel.members.size - 1) / 2);
				if (!player.skipAmount) player.skipAmount = [];
				let alr = false;
				for (const i of player.skipAmount) { if (i == interaction.member.id) alr = true; }
				if (alr) return interaction.channel.send({ content: msg.music.skip.alrvoted });
				player.skipAmount.push(interaction.member.id);
				if (player.skipAmount.length < requiredAmount) return interaction.channel.send({ content: `<:skip:${skip}> ${msg.music.skip.skipping.replace('-f', `${player.skipAmount.length} / ${requiredAmount}`)}` });
				player.skipAmount = null;
			}

			// Skip the song and reply with song that was skipped
			player.stop();
			const song = player.queue.current;
			const SkipEmbed = new Embed()
				.setDescription(`<:skip:${skip}> **${msg.music.skip.skipped}**\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setThumbnail(song.img)
				.setFooter({ text: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL() });
			await interaction.channel.send({ embeds: [SkipEmbed] });

			// After 10 seconds, compress message
			await sleep(10000);
			interaction.channel.send({ embeds: [compressEmbed(SkipEmbed)] });
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};