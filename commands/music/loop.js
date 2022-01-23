const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { loop } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'loop',
	description: 'Toggle music loop',
	aliases: ['l'],
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		const song = player.queue.current;
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
			const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
			if (!player.loopTrackAmount) player.loopTrackAmount = [];
			let alr = false;
			player.loopTrackAmount.forEach(i => { if (i == message.member.id) alr = true; });
			if (alr) return message.reply('You\'ve already voted to toggle the Track Loop!');
			player.loopTrackAmount.push(message.member.id);
			if (player.loopTrackAmount.length < requiredAmount) return message.reply(`**Toggle Track Loop?** \`${player.loopTrackAmount.length} / ${requiredAmount}\``);
			player.loopTrackAmount = null;
		}
		player.setTrackRepeat(!player.trackRepeat);
		const trackRepeat = player.trackRepeat ? 'Now' : 'No Longer';
		const thing = new MessageEmbed()
			.setColor(song.color)
			.setThumbnail(song.img)
			.setTimestamp()
			.setDescription(`${loop} **${trackRepeat} Looping the track**\n[${song.title}](${song.uri}) \`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]`);
		return message.reply({ embeds: [thing] });
	},
};