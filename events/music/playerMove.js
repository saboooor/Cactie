module.exports = async (client, player, oldChannel, newChannel) => {
	const guild = client.guilds.cache.get(player.guild);
	oldChannel = guild.channels.cache.get(oldChannel);
	newChannel = guild.channels.cache.get(newChannel);
	if (!newChannel) client.logger.info(`Player has been disconnected in ${guild.name} from ${oldChannel.name}`);
	else client.logger.info(`Player has been moved in ${guild.name} from ${oldChannel.name} to ${newChannel.name}`);
};