const { EmbedBuilder } = require('discord.js');
const { play, pause } = require('../../lang/int/emoji.json');
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
	if (!song) return;

	const srvconfig = await client.getData('settings', 'guildId', guildId);
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${song.requester.id}'`);
	let lang = require('../../lang/English/msg.json');
	if (newState.guild.preferredLocale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (newState.guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../lang/${srvconfig.language}/msg.json`);
	if (data[0]) lang = require(`../../lang/${data[0].language}/msg.json`);

	const PauseEmbed = new EmbedBuilder()
		.setDescription(`<:pause:${pause}> **${lang.music.pause.ed}**\n[${song.title}](${song.uri})`)
		.setColor(song.colors[0])
		.setThumbnail(song.img);
	const ResEmbed = new EmbedBuilder()
		.setDescription(`<:play:${play}> **${lang.music.pause.un}**\n[${song.title}](${song.uri})`)
		.setColor(song.colors[0])
		.setThumbnail(song.img);
	const textChannel = newState.guild.channels.cache.get(player.textChannel);
	if (newState.serverMute == true && oldState.serverMute == false && oldState.id == client.user.id) {
		player.pause(true);
		client.logger.info(`Paused player in ${newState.guild.name} because of server mute`);
		PauseEmbed.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.srvmute}` });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [PauseEmbed] }).catch(err => client.logger.warn(err));
		else textChannel.send({ embeds: [PauseEmbed] });
		return player.timeout = Date.now() + 300000;
	}
	if (newState.serverMute == false && oldState.serverMute == true && oldState.id == client.user.id) {
		player.pause(false);
		client.logger.info(`Resumed player in ${newState.guild.name} because of server unmute`);
		ResEmbed.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.srvunmute}` });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [ResEmbed] }).catch(err => client.logger.warn(err));
		else textChannel.send({ embeds: [ResEmbed] });
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

	let deafened = true;
	stateChange.members.forEach(member => { if (!member.voice.selfDeaf) deafened = false; });

	if (stateChange.type == 'LEAVE' && stateChange.members.size == 0) {
		player.pause(true);
		client.logger.info(`Paused player in ${newState.guild.name} because of empty channel`);
		PauseEmbed.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.leave}` });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [PauseEmbed] }).catch(err => client.logger.warn(err));
		else textChannel.send({ embeds: [PauseEmbed] });
		return player.timeout = Date.now() + 300000;
	}
	else if (stateChange.type == 'JOIN' && stateChange.members.size == 1 && player.paused && !deafened) {
		player.pause(false);
		client.logger.info(`Resumed player in ${newState.guild.name} because of user join`);
		ResEmbed.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.join}` });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [ResEmbed] }).catch(err => client.logger.warn(err));
		else if (!oldState.guild.members.cache.get(oldState.id).user.bot) textChannel.send({ embeds: [ResEmbed] });
		return player.timeout = null;
	}

	if (deafened) {
		player.pause(true);
		client.logger.info(`Paused player in ${newState.guild.name} because of user deafen`);
		PauseEmbed.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.deafened}` });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [PauseEmbed] }).catch(err => client.logger.warn(err));
		else textChannel.send({ embeds: [PauseEmbed] });
		return player.timeout = Date.now() + 300000;
	}
	else if (player.paused) {
		player.pause(false);
		client.logger.info(`Resumed player in ${newState.guild.name} because of user undeafen`);
		ResEmbed.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.undeafened}` });
		if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [ResEmbed] }).catch(err => client.logger.warn(err));
		else textChannel.send({ embeds: [ResEmbed] });
		return player.timeout = null;
	}
};
