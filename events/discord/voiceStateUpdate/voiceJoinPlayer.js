const { EmbedBuilder } = require('discord.js');
const { play } = require('../../lang/int/emoji.json');
module.exports = async (client, oldState, newState) => {
	// Check if the user actually joined
	if (oldState.channelId != null || newState.channelId == null) return;

	// get guild and player
	const guild = newState.guild;
	const textChannel = guild.channels.cache.get(player.textChannel);
	const player = client.manager.get(guild.id);
	const members = newState.channel.members.filter(member => !member.user.bot);

	// Check if the amount of members is 1
	if (members.size != 1) return;

	// check if the bot is active (playing, paused or empty does not matter (return otherwise)
	if (!player || player.state !== 'CONNECTED') return;
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

	// Create pause embed
	const ResumeEmbed = new EmbedBuilder()
		.setDescription(`<:play:${play}> **${lang.music.pause.un}**\n[${song.title}](${song.uri})`)
		.setColor(song.colors[0])
		.setThumbnail(song.img)
		.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.leave}` });

	// Pause and log
	player.pause(false);
	client.logger.info(`Resumed player in ${guild.name} because of user join`);

	// Send embed as now playing message
	if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [ResumeEmbed] }).catch(err => client.logger.warn(err));
	else textChannel.send({ embeds: [ResumeEmbed] });

	// Set the player timeout
	return player.timeout = Date.now() + 300000;
};
