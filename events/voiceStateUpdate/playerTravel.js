const { EmbedBuilder } = require('discord.js');
const { pause, play } = require('../../lang/int/emoji.json');
module.exports = async (client, oldState, newState) => {
	// Check if the mute state actually changed
	if (oldState.channelId == newState.channelId) return;

	// get guild and player
	const guild = newState.guild;
	const player = client.manager.get(guild.id);
	if (!player || player.state !== 'CONNECTED' || (player.voiceChannel != oldState.channelId && player.voiceChannel != newState.channelId)) return;
	const textChannel = guild.channels.cache.get(player.textChannel);
	const voiceChannel = guild.channels.cache.get(player.voiceChannel);
	const song = player.queue.current;
	if (!song) return;

	// Set lang
	const srvconfig = await client.getData('settings', 'guildId', guild.id);
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${song.requester.id}'`);
	let lang = require('../../lang/English/msg.json');
	if (guild.preferredLocale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../lang/${srvconfig.language}/msg.json`);
	if (data[0]) lang = require(`../../lang/${data[0].language}/msg.json`);

	// Chcck if player should be paused or not or the event should be ignored
	let playerpause;
	const members = voiceChannel.members.filter(member => !member.user.bot);
	if (members.size == 0) playerpause = true;
	else if (!oldState.channelId && newState.channelId && members.size == 1) playerpause = false;
	else return;

	// Pause and log
	player.pause(playerpause);
	client.logger.info(playerpause ? `Paused player in ${guild.name} because of empty channel` : `Resumed player in ${guild.name} because of user join`);

	// Create pause/resume embeds
	const PauseEmbed = new EmbedBuilder()
		.setColor(song.colors[0])
		.setThumbnail(song.img)
		.setDescription(`<:pause:${pause}> **${lang.music.pause.ed}**\n[${song.title}](${song.uri})`)
		.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.leave}` });
	const ResumeEmbed = new EmbedBuilder()
		.setColor(song.colors[0])
		.setThumbnail(song.img)
		.setDescription(`<:play:${play}> **${lang.music.pause.un}**\n[${song.title}](${song.uri})`)
		.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.join}` });

	// Send embed as now playing message
	if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [playerpause ? PauseEmbed : ResumeEmbed] }).catch(err => client.logger.warn(err));
	else textChannel.send({ embeds: [playerpause ? PauseEmbed : ResumeEmbed] });

	// Set the player timeout
	return player.timeout = playerpause ? Date.now() + 300000 : null;
};
