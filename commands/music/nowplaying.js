const { Embed, ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { progressbar } = require('../../functions/music/progressbar.js');
const { shuffle, skip, music, refresh } = require('../../lang/int/emoji.json');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'nowplaying',
	description: 'Show now playing song',
	aliases: ['playing', 'np'],
	serverUnmute: true,
	player: true,
	ephemeral: true,
	async execute(message, args, client) {
		try {
			// Get player, current song, and song position / length and send embed
			const player = client.manager.get(message.guild.id);
			const song = player.queue.current;
			const total = song.duration;
			const current = player.position;
			const NPEmbed = new Embed()
				.setDescription(`${msg.music.np} \`[${convertTime(current)} / ${convertTime(total).replace('7:12:56', 'LIVE')}]\`\n[${song.title}](${song.uri})\n\`${progressbar(total, current, 20, '▬', '🔘')}\``)
				.setFooter({ text: song.requester.tag, iconURL: song.requester.displayAvatarURL() })
				.setThumbnail(song.img)
				.setColor(song.color);
			const row = new ActionRow()
				.addComponents(
					new ButtonComponent()
						.setCustomId('music_shuffle')
						.setEmoji({ id: shuffle })
						.setStyle(ButtonStyle.Secondary),
					new ButtonComponent()
						.setCustomId('music_skip')
						.setEmoji({ id: skip })
						.setStyle(ButtonStyle.Secondary),
					new ButtonComponent()
						.setCustomId('music_updatenp')
						.setLabel('Refresh')
						.setEmoji({ id: refresh })
						.setStyle(ButtonStyle.Secondary),
				);
			if (client.user.id == '765287593762881616') {
				row.addComponents(
					new ButtonComponent()
						.setURL('https://pup.smhsmh.club/music')
						.setEmoji({ id: music })
						.setLabel('Music Control Panel')
						.setStyle('LINK'),
				);
			}
			const npmsg = await message.reply({ embeds: [NPEmbed], components: [row] });

			// Set the now playing message
			if (!message.commandName) player.setNowplayingMessage(npmsg);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};