const playSongs = require('../functions/music/playSongs.js');
module.exports = {
	name: 'music_playlast',
	async execute(interaction, client) {
		try {
			// Get the song link from the embed description
			const a = interaction.message.embeds[0].description.split('](');
			const b = a[a.length - 1].split(')')[0];
			client.logger.info(b);

			// Queue up the song in the embed
			playSongs(interaction.member, interaction.message, [b], client);
		}
		catch (err) { client.error(err, interaction); }
	},
};