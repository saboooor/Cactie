const { MessageEmbed } = require('discord.js');
module.exports = async function addVote(body, client) {
	const user = client.users.cache.get(body.id) || client.users.cache.get(body.user);
	if (!user) client.logger.info(`Got vote from ${body.id || body.user}!`);
	else client.logger.info(`Got vote from ${user.tag}!`);
	const Embed = new MessageEmbed()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle('Vote Received!')
		.setDescription(`Thank you for voting, <@${user.id || body.id || body.user}>!`);
	client.guilds.cache.get('811354612547190794').channels.cache.get('931848198773948427').send({ embeds: [Embed] });
	await client.setData('lastvoted', 'userId', `${body.id || body.user}`, 'timestamp', Date.now());
};