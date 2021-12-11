module.exports = async (client, player, track) => {
	player.queue.history.push(track);
};