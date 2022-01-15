module.exports = async function addVote(body, client) {
	const user = client.users.cache.get(body.id) || client.users.cache.get(body.user);
	if (!user) client.logger.info(`Got vote from ${body.id || body.user}!`);
	else client.logger.info(`Got vote from ${user.tag}!`);
	await client.setData('lastvoted', 'userId', `${body.id || body.user}`, 'timestamp', Date.now());
};