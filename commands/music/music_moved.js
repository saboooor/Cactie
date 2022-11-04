const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'music_moved',
	description: 'Music has been moved to [Cactie Music](https://github.com/saboooor/Cactie-Music)',
	aliases: ['nowplaying', 'playing', 'np', 'play', 'p', 'pause', 'r', 'resume', 'unpause', 'playtop', 'pt', 'ptop', 'queue', 'q', 'search', 'playsearch', 'ps', 'volume', 'v', 'vol'],
	cooldown: 5,
	async execute(message, args, client) {
		try {
			const Embed = new EmbedBuilder()
				.setColor('Random')
				.setDescription('Music has been moved to [Cactie Music](https://github.com/saboooor/Cactie-Music) Due to the YouTube Terms of Service until Cactie stops using YouTube to play Music.');
			message.reply({ embeds: [Embed] });
		}
		catch (err) { client.error(err, message); }
	},
};
