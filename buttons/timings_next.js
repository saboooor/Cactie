const analyzeTimings = require('../functions/timings/analyzeTimings');
module.exports = {
	name: 'timings_next',
	async execute(interaction, client) {
		try {
			// Analyze timings with the url in the author field
			await interaction.reply(await analyzeTimings(interaction, client, [interaction.message.embeds[0].author.url]));
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};