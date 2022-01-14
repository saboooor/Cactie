module.exports = async function addVote(body, client) {
	const user = client.users.cache.get(body.id) || client.users.cache.get(body.user);
	if (!user) return client.logger.info(`Got vote from ${body.id || body.user} (Invalid user, not giving vote perks)`);
	client.logger.info(`Got vote from ${user.tag}!`);
	user.send('Thanks for voting for Pup!');
	await client.setData('lastvoted', 'userId', `${user.id}`, 'timestamp', Date.now());
};