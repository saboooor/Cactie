const { Embed } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { refresh } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'loop',
	description: 'Toggle music loop',
	aliases: ['l'],
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
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
				if (alr) return message.reply({ content: 'You\'ve already voted to toggle the Track Loop!' });
				player.loopTrackAmount.push(message.member.id);
				if (player.loopTrackAmount.length < requiredAmount) return message.reply({ content: `**Toggle Track Loop?** \`${player.loopTrackAmount.length} / ${requiredAmount}\`` });
				player.loopTrackAmount = null;
			}

			// Toggle loop
			player.setTrackRepeat(!player.trackRepeat);

			// Send message to channel with current song looped
			const song = player.queue.current;
			const trackRepeat = player.trackRepeat ? 'Now' : 'No Longer';
			const LoopEmbed = new Embed()
				.setColor(song.color)
				.setThumbnail(song.img)
				.setTimestamp()
				.setDescription(`<:refresh:${refresh}> **${trackRepeat} Looping the track**\n[${song.title}](${song.uri})\n\`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]`);
			return message.reply({ embeds: [LoopEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};