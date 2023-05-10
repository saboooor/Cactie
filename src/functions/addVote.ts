import { PrismaClient } from '@prisma/client';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';

export default async function addVote(body: {
  id?: string;
  user?: string;
}, client: Client) {
  const user = body.id ? client.users.cache.get(body.id) : body.user ? client.users.cache.get(body.user) : undefined;
  if (!user) logger.info(`Got vote from ${body.id || body.user}!`);
  else logger.info(`Got vote from ${user.tag}!`);
  const VoteEmbed = new EmbedBuilder()
    .setColor('Random')
    .setTitle('Vote Received!')
    .setDescription(`Thank you for voting, <@${user?.id || body.id || body.user}>!`);
  const channel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('931848198773948427')! as TextChannel;
  channel?.send({ embeds: [VoteEmbed] });

  // Get server config
  const prisma = new PrismaClient();
  await prisma.lastvoted.upsert({
    where: { userId: `${body.id || body.user}` },
    create: { userId: `${body.id || body.user}`, timestamp: `${Date.now()}` },
    update: { timestamp: `${Date.now()}` },
  });
}