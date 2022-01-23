function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'skip',
	aliases: ['s', 'skipto'],
	description: 'Skip the currently playing song',
	usage: '[Index of song in queue]',
	serverUnmute: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		const errEmbed = new MessageEmbed()
			.setColor('RED');
		if (args[0]) {
			if (srvconfig.djrole != 'false') {
				const role = message.guild.roles.cache.get(srvconfig.djrole);
				if (!role) return message.reply({ content: 'Error: The DJ role can\'t be found!' });
				if (!message.member.roles.cache.has(srvconfig.djrole)) {
					errEmbed.setDescription(`You need the ${role} role to do that!`);
					return message.reply({ embeds: [errEmbed] });
				}
			}
			const position = Number(args[0]);
			if (position < 0 || position > player.queue.size) {
				errEmbed.setDescription('Usage: /skip [Number of song in queue]');
				return message.reply({ embeds: [errEmbed] });
			}
			else if (position) {
				player.queue.remove(0, position - 1);
				player.stop();
				const thing = new MessageEmbed()
					.setDescription(`⏭️ Skipped **${position}** Songs`)
					.setColor(Math.round(Math.random() * 16777215))
					.setTimestamp();
				const msg = await message.reply({ embeds: [thing] });
				await sleep(10000);
				return message.commandName ? message.deleteReply() : msg.edit({ content: '**Skipped**', embeds: [] });
			}
		}
		if (srvconfig.djrole != 'false') {
			const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
			if (!player.skipAmount) player.skipAmount = [];
			let alr = false;
			player.skipAmount.forEach(i => { if (i == message.member.id) alr = true; });
			if (alr) return message.reply('You\'ve already voted to skip this song!');
			player.skipAmount.push(message.member.id);
			if (player.skipAmount.length < requiredAmount) return message.reply(`**Skipping?** \`${player.skipAmount.length} / ${requiredAmount}\` Use \`/forceskip\` to force skip`);
			player.skipAmount = null;
		}
		const song = player.queue.current;
		player.stop();
		const thing = new MessageEmbed()
			.setDescription(`⏭️ **Skipped**\n[${song.title}](${song.uri})`)
			.setColor(song.color)
			.setTimestamp()
			.setThumbnail(song.img);
		const msg = await message.reply({ embeds: [thing] });
		await sleep(10000);
		message.commandName ? message.deleteReply() : msg.edit({ content: '**Skipped**', embeds: [] });
	},
};