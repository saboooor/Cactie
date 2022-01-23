function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
const { warn } = require('../config/emoji.json');
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
	if (newState.serverMute == true && oldState.serverMute == false && oldState.id == client.user.id) {
		client.logger.info(`Paused player in ${newState.guild.name} because of server mute`);
		return player.pause(true);
	}
	if (newState.serverMute == false && oldState.serverMute == true && oldState.id == client.user.id) {
		client.logger.info(`Resumed player in ${newState.guild.name} because of server unmute`);
		return player.pause(false);
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

	switch (stateChange.type) {
	case 'JOIN':
		if (stateChange.members.size === 1 && player.paused) {
			player.pause(false);
			client.logger.info(`Resumed player in ${newState.guild.name} because of user join`);
		}
		break;
	case 'LEAVE':
		if (stateChange.members.size === 0) {
			if (!player.paused && player.playing) {
				player.pause(true);
				client.logger.info(`Paused player in ${newState.guild.name} because of empty channel`);
			}
			if (!player.twentyFourSeven) {
				await sleep(300000);
				if (stateChange.channel.members.filter(member => !member.user.bot).size >= 1) return;
				const channel = client.channels.cache.get(player.textChannel);
				const Embed = new MessageEmbed()
					.setColor(Math.round(Math.random() * 16777215))
					.setDescription(`${warn} **Left because of 5 minutes of inactivity!**`)
					.addField('Tired of me leaving?', 'Enable the **24/7** mode with the /247 command!')
					.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic : true }) });
				const NowPlaying = await channel.send({ embeds: [Embed] });
				player.setNowplayingMessage(NowPlaying);
				player.destroy();
				client.logger.info(`Destroyed player in ${newState.guild.name} because of empty channel`);
			}
		}
		break;
	}
};