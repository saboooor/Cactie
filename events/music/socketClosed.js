module.exports = async (client, player, payload) => {
	const guild = client.guilds.cache.get(player.guild);
	if (payload.byRemote == true) player.destroy();
	client.logger.error(`Socket has been closed because ${payload.reason} in ${guild.name}`);
	if (!payload.reason && !guild.me.voice.serverMute) player.stop();
};