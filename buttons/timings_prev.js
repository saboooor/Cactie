const analyzeTimings = require('../functions/analyzeTimings');
module.exports = {
	name: 'timings_prev',
	async execute(interaction, client) {
		await interaction.reply(await analyzeTimings(interaction, client, [interaction.message.embeds[0].author.url]));
	},
};