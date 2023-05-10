import { PrismaClient } from '@prisma/client';
import { schedule } from 'node-cron';

export default async () => schedule('* * * * *', async () => {
  // Get all user data
  const prisma = new PrismaClient();
  const userdata = await prisma.userdata.findMany();

  // If any user has not voted in 24 hours, remove them from the vote database
  userdata.forEach(async data => {
    if (!data.lastvoted) return;
    if (Number(data.lastvoted) + 86400000 < Date.now()) await prisma.userdata.update({ where: { userId: data.userId }, data: { lastvoted: null } });
  });
});