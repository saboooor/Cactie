function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
const { skip, jump } = require('../../config/emoji.json');
module.exports = {
	name: 'previous',
	aliases: ['prev'],
	description: 'Go back to the previous song',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		if (message.guild.me.voice.serverMute) return message.reply({ content: 'I\'m server muted!' });
		if (!player) return message.reply('The bot is not playing anything!');
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		const errEmbed = new MessageEmbed()
			.setColor('RED');
		const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
		if (!player.prevAmount) player.prevAmount = [];
		let alr = false;
		player.prevAmount.forEach(i => { if (i == message.member.id) alr = true; });
		if (alr) return message.reply('You\'ve already voted to go back to the previous song!');
		player.prevAmount.push(message.member.id);
		if (player.prevAmount.length < requiredAmount) return message.reply(`**Previous song?** \`${player.prevAmount.length} / ${requiredAmount}\` Use \`${srvconfig.prefix}forceprev\` to force prev`);
		player.prevAmount = null;
		player.queue.reverse();
		player.queue.add(player.queue.current);
		player.queue.reverse();
		player.queue.history.reverse();
		player.queue.add(player.queue.history[0]);
		player.queue.history.pop();
		player.queue.history.reverse();
		player.stop();
		const song = player.queue.current;
		const thing = new MessageEmbed()
			.setDescription(`${skip} **Previous song**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(song.img);
		const msg = await message.reply({ embeds: [thing] });
		await sleep(10000);
		message.commandName ? message.deleteReply() : msg.edit({ content: '**Skipped**', embeds: [] });
	},
};