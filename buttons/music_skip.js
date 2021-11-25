const { MessageEmbed } = require('discord.js');
const { skip } = require('../config/emoji.json');
module.exports = {
	name: 'music_skip',
	async execute(interaction, client) {
		const player = client.manager.get(interaction.guild.id);
		const error = new MessageEmbed().setColor('RED');
		if ((!player || !player.queue.current)) {
			error.setDescription('There is no music playing.');
			return interaction.reply({ embeds: [error] });
		}
		if (!interaction.member.voice.channel) {
			error.setDescription('You must be in a voice channel!');
			return interaction.reply({ embeds: [error] });
		}
		if (interaction.member.voice.channel !== interaction.guild.me.voice.channel) {
			error.setDescription(`You must be in the same channel as ${client.user}!`);
			return interaction.reply({ embeds: [error] });
		}
		if (interaction.guild.me.voice.serverMute) return interaction.reply({ content: 'I\'m server muted!', ephemeral: true });
		if (!player) return interaction.reply({ content: 'The bot is not playing anything!', ephemeral: true });
		const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
		const requiredAmount = Math.floor((interaction.guild.me.voice.channel.members.size - 1) / 2);
		if (!player.skipAmount) player.skipAmount = [];
		let alr = false;
		player.skipAmount.forEach(i => { if (i == interaction.member.id) alr = true; });
		if (alr) return interaction.reply({ content: 'You\'ve already voted to skip this song!', ephemeral: true });
		player.skipAmount.push(interaction.member.id);
		if (player.skipAmount.length < requiredAmount) return interaction.reply(`**Skipping?** \`${player.skipAmount.length} / ${requiredAmount}\` Use \`${srvconfig.prefix}skip\` to skip or \`${srvconfig.prefix}forceskip\` to force skip`);
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
		return interaction.reply({ embeds: [thing] });
	},
};