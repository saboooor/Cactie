module.exports = async (client, player) => {
	client.logger.info(`Player has been created in ${client.guilds.cache.get(player.guild).name}`);
	player.queue.history = [];
};