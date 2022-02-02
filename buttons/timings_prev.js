const analyzeTimings = require('../functions/timings/analyzeTimings');
module.exports = {
	name: 'timings_prev',
	async execute(interaction, client) {
		try {
			// Analyze timings with the url in the author field
			await interaction.editReply(await analyzeTimings(interaction, client, [interaction.message.embeds[0].author.url]));
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};