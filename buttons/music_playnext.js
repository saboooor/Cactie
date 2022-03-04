const playSongs = require('../functions/music/playSongs.js');
module.exports = {
	name: 'music_playnext',
	async execute(interaction, client) {
		try {
			// Get the song link from the embed description
			const a = interaction.message.embeds[0].description.split('](');
			const b = a[a.length - 1].split(')')[0];

			// Queue up the song in the embed, True is to playtop it
			playSongs(interaction.member.user, interaction.message, [b], client, true);
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};