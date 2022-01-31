const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'r34',
	async execute(message, args, client) {
		try {
			redditFetch(['rule34', 'Rule_34', 'Rule34LoL', 'Overwatch_Porn', 'OverwatchNSFW', 'rule34gifs'], message, client);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};