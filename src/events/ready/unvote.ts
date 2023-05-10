import { PrismaClient } from '@prisma/client';
import { schedule } from 'node-cron';

export default async () => schedule('* * * * *', async () => {
  // Get all users who have voted recently
  const prisma = new PrismaClient();
  const voteData = await prisma.lastvoted.findMany();

  // If any user has not voted in 24 hours, remove them from the vote database
  voteData.forEach(async data => {
    if (Number(data.timestamp) + 86400000 < Date.now()) await prisma.lastvoted.delete({ where: { userId: data.userId } });
  });
});