const { schedule } = require('node-cron');

module.exports = async client => {
	schedule('* * * * *', async () => {
		// Get all users who have voted recently
		const voteData = await sql.getData('lastvoted', null, { all: true });

		// If any user has not voted in 24 hours, remove them from the vote database
		voteData.forEach(async data => {
			if (data.timestamp + 86400000 < Date.now()) await sql.delData('lastvoted', { userId: data.userId });
		});
	});
};