const { schedule } = require('node-cron');

module.exports = async client => {
	schedule('* * * * *', async () => {
		// Get all users who have voted recently
		const voteData = await client.query('SELECT * FROM lastvoted');
		voteData.forEach(async data => {
			if (data.timestamp + 86400000 < Date.now()) {
				// If the user has not voted in 24 hours, remove them from the vote database
				await client.delData('lastvoted', 'userId', data.userId);
			}
		});
	});
};