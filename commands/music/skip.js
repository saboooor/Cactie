const { MessageEmbed } = require('discord.js');
const { skip } = require('../../config/emoji.json');
module.exports = {
	name: 'skip',
	aliases: ['s'],
	description: 'Skip the currently playing song',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		if (message.guild.me.voice.serverMute) return message.reply({ content: 'I\'m server muted!', ephemeral: true });
		if (!player) return message.reply('The bot is not playing anything!');
		const srvconfig = client.settings.get(message.guild.id);
		const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
		if (!player.skipAmount) player.skipAmount = [];
		let alr = false;
		player.skipAmount.forEach(i => { if (i == message.member.id) alr = true; });
		if (alr) return message.reply('You\'ve already voted to skip this song!');
		player.skipAmount.push(message.member.id);
		if (player.skipAmount.length < requiredAmount) return message.reply(`**Skipping?** \`${player.skipAmount.length} / ${requiredAmount}\` Use \`${srvconfig.prefix}forceskip\` to force skip`);
		player.skipAmount = null;
		const autoplay = player.get('autoplay');
		const song = player.queue.current;
		if (autoplay === false) {
			player.stop();
		}
		else {
			player.stop();
			player.queue.clear();
			player.set('autoplay', false);
		}
		const thing = new MessageEmbed()
			.setDescription(`${skip} **Skipped**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(song.img);
		return message.reply({ embeds: [thing] });
	},
};