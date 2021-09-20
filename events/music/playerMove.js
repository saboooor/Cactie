module.exports = async (client, player, oldChannel, newChannel) => {
	player.voiceChannel = client.channels.cache.get(newChannel);
	client.logger.info(`Player has been moved in ${player.guild} from ${oldChannel} to ${player.voiceChannel.name}`);
};