const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'r34',
	aliases: ['rule34'],
	description: 'r/rule34, r/Rule_34, r/Rule34LoL, r/Overwatch_Porn, r/r34Dokkaebi, r/rule34gifs, r/RobloxR34, r/r34_hades, r/Fridaynighfuckin, r/R34danganronpa, r/R34fortnite',
	async execute(message, args, client) {
		try {
			redditFetch(['rule34', 'Rule_34', 'Rule34LoL', 'Overwatch_Porn', 'r34Dokkaebi', 'rule34gifs', 'RobloxR34', 'r34_hades', 'Fridaynighfuckin', 'R34danganronpa', 'R34fortnite'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};