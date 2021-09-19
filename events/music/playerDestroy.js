module.exports = async (client, player) => {
	client.logger.info(`Player has been destroyed in ${client.guilds.cache.get(player.guild).name}`);
};