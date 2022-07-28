const playSongs = require('../functions/music/playSongs.js');

module.exports = {
	name: 'music_playnext',
	invc: true,
	samevc: true,
	async execute(interaction, client, lang) {
		try {
			// Get the song link from the embed description
			const a = interaction.message.embeds[0].description.split('](');
			const b = a[a.length - 1].split(')')[0];
			logger.info(b);

			// Queue up the song in the embed, True is to playtop it
			playSongs(interaction.member, interaction.message, [b], client, lang, true);
		}
		catch (err) { client.error(err, interaction); }
	},
};