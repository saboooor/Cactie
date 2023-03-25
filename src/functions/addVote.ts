import { Client, EmbedBuilder, GuildBasedChannel, TextBasedChannel, TextChannel } from 'discord.js';

export default async function addVote(body: any, client: Client) {
	const user = client.users.cache.get(body.id) || client.users.cache.get(body.user);
	if (!user) logger.info(`Got vote from ${body.id || body.user}!`);
	else logger.info(`Got vote from ${user.tag}!`);
	const VoteEmbed = new EmbedBuilder()
		.setColor('Random')
		.setTitle('Vote Received!')
		.setDescription(`Thank you for voting, <@${user?.id || body.id || body.user}>!`);
	const channel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('931848198773948427')! as TextChannel;
	channel?.send({ embeds: [VoteEmbed] });

	// @ts-ignore
	await sql.setData('lastvoted', { userId: `${body.id || body.user}` }, { timestamp: Date.now() });
};