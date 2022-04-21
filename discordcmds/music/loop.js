function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
const compressEmbed = require('../../functions/compressEmbed');
const { convertTime } = require('../../functions/music/convert.js');
const { refresh } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'loop',
	description: 'Toggle track loop',
	aliases: ['l'],
	player: true,
	playing: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	async execute(message, args, client) {
		try {
			// Get the player
			const player = client.manager.get(message.guild.id);

			// Check if djrole is set, if so, check if user has djrole, if not, vote for loop instead of looping
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
				const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
				if (!player.loopTrackAmount) player.loopTrackAmount = [];
				let alr = false;
				for (const i of player.loopTrackAmount) { if (i == message.member.id) alr = true; }
				if (alr) return client.error(message.lang.music.track.loopalr, message, true);
				player.loopTrackAmount.push(message.member.id);
				if (player.loopTrackAmount.length < requiredAmount) return message.reply({ content: `**${message.lang.music.track.looping[player.trackRepeat ? 'off' : 'on']}** \`${player.loopTrackAmount.length} / ${requiredAmount}\`` });
				player.loopTrackAmount = null;
			}

			// Toggle loop
			player.setTrackRepeat(!player.trackRepeat);

			// Send message to channel with current song looped
			const song = player.queue.current;
			const LoopEmbed = new EmbedBuilder()
				.setColor(song.color)
				.setThumbnail(song.img)
				.setDescription(`<:refresh:${refresh}> **${message.lang.music.track.loop[player.trackRepeat ? 'on' : 'off']}** \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\`\n[${song.title}](${song.uri})`)
				.setFooter({ text: song.requester.tag, iconURL: song.requester.displayAvatarURL() });
			const loopmsg = await message.reply({ embeds: [LoopEmbed] });

			// Wait 10 seconds and compress the message
			await sleep(10000);
			message.commandName ? message.editReply({ embeds: [compressEmbed(LoopEmbed)] }) : loopmsg.edit({ embeds: [compressEmbed(LoopEmbed)] });
		}
		catch (err) { client.error(err, message); }
	},
};