const { EmbedBuilder } = require('discord.js');

module.exports = async function addVote(body, client) {
	const user = client.users.cache.get(body.id) || client.users.cache.get(body.user);
	if (!user) logger.info(`Got vote from ${body.id || body.user}!`);
	else logger.info(`Got vote from ${user.tag}!`);
	const VoteEmbed = new EmbedBuilder()
		.setColor('Random')
		.setTitle('Vote Received!')
		.setDescription(`Thank you for voting, <@${user.id || body.id || body.user}>!`);
	client.guilds.cache.get('811354612547190794').channels.cache.get('931848198773948427').send({ embeds: [VoteEmbed] });
	await client.setData('lastvoted', { userId: `${body.id || body.user}` }, { timestamp: Date.now() });
};