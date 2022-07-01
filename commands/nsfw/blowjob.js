const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'blowjob',
	description: 'r/BlowJob, r/Blowjobs, r/BlowjobOnAllFours, r/BlowjobGradeA, r/BlowjobTongue',
	async execute(message, args, client) {
		try {
			redditFetch(['BlowJob', 'Blowjobs', 'BlowjobOnAllFours', 'BlowjobGradeA', 'BlowjobTongue'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};