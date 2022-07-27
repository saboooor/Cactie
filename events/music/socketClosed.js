module.exports = async (client, player, payload) => {
	const guild = client.guilds.cache.get(player.guild);
	logger.error(`Socket has been closed because ${payload.reason} in ${guild ? guild.name : player.guild}`);
};