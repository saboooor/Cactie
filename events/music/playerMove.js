module.exports = async (client, player, oldChannel, newChannel) => {
	player.voiceChannel = client.channels.cache.get(newChannel);
	client.logger.info(`Player has been moved in ${client.guilds.cache.get(player.guild).name} from ${oldChannel} to ${player.voiceChannel.name}`);
};