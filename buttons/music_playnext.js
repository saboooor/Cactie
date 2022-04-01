const playSongs = require('../functions/music/playSongs.js');
module.exports = {
	name: 'music_playnext',
	serverUnmute: true,
	inVoiceChannel: true,
	async execute(interaction, client) {
		try {
			if (interaction.guild.me.voice.channel && interaction.guild.me.voice.channel.id !== interaction.member.voice.channel.id) return;
			// Get the song link from the embed description
			const a = interaction.message.embeds[0].description.split('](');
			const b = a[a.length - 1].split(')')[0];
			client.logger.info(b);

			// Queue up the song in the embed, True is to playtop it
			playSongs(interaction.member, interaction.message, [b], client, true);
		}
		catch (err) { client.error(err, interaction); }
	},
};