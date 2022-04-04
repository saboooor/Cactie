const { EmbedBuilder } = require('discord.js');
const { play, pause } = require('../lang/int/emoji.json');
module.exports = async (client, oldState, newState) => {
	// get guild and player
	const guildId = newState.guild.id;
	const player = client.manager.get(guildId);

	// check if the bot is active (playing, paused or empty does not matter (return otherwise)
	if (!player || player.state !== 'CONNECTED') return;

	const stateChange = {};

	if (oldState.channel === null && newState.channel !== null) stateChange.type = 'JOIN';
	if (oldState.channel !== null && newState.channel === null) stateChange.type = 'LEAVE';
	if (oldState.channel !== null && newState.channel !== null) stateChange.type = 'MOVE';
	if (oldState.channel === null && newState.channel === null) return;
	const song = player.queue.current;
	const PauseEmbed = new EmbedBuilder()
		.setDescription(`<:pause:${pause}> **Paused**\n[${song.title}](${song.uri})`)
		.setColor(song.color)
		.setThumbnail(song.img);
	const ResEmbed = new EmbedBuilder()
		.setDescription(`<:play:${play}> **Resumed**\n[${song.title}](${song.uri})`)
		.setColor(song.color)
		.setThumbnail(song.img);
	if (newState.serverMute == true && oldState.serverMute == false && oldState.id == client.user.id) {
		player.pause(true);
		client.logger.info(`Paused player in ${newState.guild.name} because of server mute`);
		PauseEmbed.setFooter({ text: 'Reason: The bot has been server muted' });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [PauseEmbed] });
		else newState.guild.channels.cache.get(player.textChannel).send({ embeds: [PauseEmbed] });
		return player.timeout = Date.now() + 300000;
	}
	if (newState.serverMute == false && oldState.serverMute == true && oldState.id == client.user.id) {
		player.pause(false);
		client.logger.info(`Resumed player in ${newState.guild.name} because of server unmute`);
		ResEmbed.setFooter({ text: 'Reason: The bot has been server unmuted' });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [ResEmbed] });
		else newState.guild.channels.cache.get(player.textChannel).send({ embeds: [ResEmbed] });
		return player.timeout = null;
	}

	// move check first as it changes type
	if (stateChange.type === 'MOVE') {
		if (oldState.channel.id === player.voiceChannel) stateChange.type = 'LEAVE';
		if (newState.channel.id === player.voiceChannel) stateChange.type = 'JOIN';
	}
	// double triggered on purpose for MOVE events
	if (stateChange.type === 'JOIN') stateChange.channel = newState.channel;
	if (stateChange.type === 'LEAVE') stateChange.channel = oldState.channel;

	// check if the bot's voice channel is involved (return otherwise)
	if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel) return;

	// filter current users based on being a bot
	stateChange.members = stateChange.channel.members.filter(member => !member.user.bot);

	if (stateChange.type == 'JOIN' && stateChange.members.size == 1) {
		player.pause(false);
		client.logger.info(`Resumed player in ${newState.guild.name} because of user join`);
		ResEmbed.setFooter({ text: 'Reason: Someone joined the voice channel' });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [ResEmbed] });
		else newState.guild.channels.cache.get(player.textChannel).send({ embeds: [ResEmbed] });
		return player.timeout = null;
	}

	if (stateChange.type == 'LEAVE' && stateChange.members.size == 0) {
		player.pause(true);
		client.logger.info(`Paused player in ${newState.guild.name} because of empty channel`);
		PauseEmbed.setFooter({ text: 'Reason: The bot has been left alone' });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [PauseEmbed] });
		else newState.guild.channels.cache.get(player.textChannel).send({ embeds: [PauseEmbed] });
		return player.timeout = Date.now() + 300000;
	}

	let deafened = true;
	stateChange.members.forEach(member => { if (!member.voice.selfDeaf) deafened = false; });

	if (deafened) {
		player.pause(true);
		client.logger.info(`Paused player in ${newState.guild.name} because of user deafen`);
		PauseEmbed.setFooter({ text: 'Reason: Everyone\'s deafened' });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [PauseEmbed] });
		else newState.guild.channels.cache.get(player.textChannel).send({ embeds: [PauseEmbed] });
		return player.timeout = Date.now() + 300000;
	}
	else if (player.paused) {
		player.pause(false);
		client.logger.info(`Resumed player in ${newState.guild.name} because of user undeafen`);
		ResEmbed.setFooter({ text: 'Reason: Someone undeafened themselves' });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [ResEmbed] });
		else newState.guild.channels.cache.get(player.textChannel).send({ embeds: [ResEmbed] });
		return player.timeout = null;
	}
};