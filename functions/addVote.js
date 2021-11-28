module.exports = function addVote(body, client) {
	const user = client.users.cache.get(body.id);
	client.logger.info(`Got vote from ${user.tag}!`);
	user.send('Thanks for voting for Pup!');
};