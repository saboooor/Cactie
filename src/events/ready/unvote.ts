import { schedule } from 'node-cron';
import { lastVoted } from '~/types/mysql';

export default async () => schedule('* * * * *', async () => {
  // Get all users who have voted recently
  const voteData = await sql.getData('lastvoted', undefined, { all: true });

  // If any user has not voted in 24 hours, remove them from the vote database
  voteData.forEach(async (data: lastVoted) => {
    if (Number(data.timestamp) + 86400000 < Date.now()) await sql.delData('lastvoted', { userId: data.userId });
  });
});