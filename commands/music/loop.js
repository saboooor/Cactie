const { MessageEmbed } = require('discord.js');
const { convertTime } = require('../../functions/convert.js');
const { loop } = require('../../config/emoji.json');
const { DefaultThumbnail } = require('../../config/music.json');
const splashy = require('splashy');
const got = require('got');
module.exports = {
	name: 'loop',
	description: 'Toggle music loop',
	aliases: ['l'],
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply({ embeds: [thing] });
		}
		const srvconfig = client.settings.get(message.guild.id);
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
		const img = player.queue.current.displayThumbnail ? player.queue.current.displayThumbnail('hqdefault') : DefaultThumbnail;
		if (!player.queue.current.color) {
			const { body } = await got(img, { encoding: null });
			const palette = await splashy(body);
			player.queue.current.color = palette[3];
		}
		const thing = new MessageEmbed()
			.setColor(player.queue.current.color)
			.setThumbnail(img)
			.setTimestamp()
			.setDescription(`${loop} **${trackRepeat} Looping**\n[${player.queue.current.title}](${player.queue.current.uri}) \`[${convertTime(player.queue.current.duration).replace('07:12:56', 'LIVE')}]\` [${player.queue.current.requester}]`);
		return message.reply({ embeds: [thing] });
	},
};