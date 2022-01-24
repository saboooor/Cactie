module.exports = {
	name: 'r34',
	async execute(message, args, client) {
		require('../../functions/redditFetch.js')(['rule34', 'Rule_34', 'Rule34LoL', 'Overwatch_Porn', 'OverwatchNSFW', 'rule34gifs'], message, client);
	},
};