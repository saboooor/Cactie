module.exports = async (client, player, oldChannel, newChannel) => {
	if (!newChannel) await player.destroy();
	else player.voiceChannel = newChannel;
};