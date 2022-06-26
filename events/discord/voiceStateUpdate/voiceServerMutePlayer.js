const { EmbedBuilder } = require('discord.js');
const { pause } = require('../../../lang/int/emoji.json');
module.exports = async (client, oldState, newState) => {
	// Check if the bot actually was server muted
	if (oldState.member.id != client.user.id || oldState.serverMute || !newState.serverMute) return;

	// get guild and player
	const guild = newState.guild;
	const player = client.manager.get(guild.id);
	if (!player) return;
	const textChannel = guild.channels.cache.get(player.textChannel);
	const members = newState.channel.members.filter(member => !member.user.bot);

	// Check if everyone is deafened
	const deafened = members.filter(member => member.voice.selfDeaf);
	if (deafened.size !== members.size) return;

	// check if the bot is active (playing, paused or empty does not matter (return otherwise)
	if (!player || player.state !== 'CONNECTED') return;
	const song = player.queue.current;
	if (!song) return;

	// Set lang
	const srvconfig = await client.getData('settings', 'guildId', guild.id);
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${song.requester.id}'`);
	let lang = require('../../../lang/English/msg.json');
	if (guild.preferredLocale.split('-')[0] == 'en') lang = require('../../../lang/English/msg.json');
	else if (guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../../lang/${srvconfig.language}/msg.json`);
	if (data[0]) lang = require(`../../../lang/${data[0].language}/msg.json`);

	// Create pause embed
	const PauseEmbed = new EmbedBuilder()
		.setDescription(`<:pause:${pause}> **${lang.music.pause.ed}**\n[${song.title}](${song.uri})`)
		.setColor(song.colors[0])
		.setThumbnail(song.img)
		.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.srvmute}` });

	// Pause and log
	player.pause(true);
	client.logger.info(`Paused player in ${guild.name} because of server mute`);

	// Send embed as now playing message
	if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [PauseEmbed] }).catch(err => client.logger.warn(err));
	else textChannel.send({ embeds: [PauseEmbed] });

	// Set the player timeout
	return player.timeout = Date.now() + 300000;
};