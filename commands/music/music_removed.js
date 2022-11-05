const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'music_removed',
	description: 'Music has been removed due to the Discord and Youtube Terms of Service. Do the music_removed command to learn more.',
	aliases: ['nowplaying', 'playing', 'np', 'play', 'p', 'pause', 'r', 'resume', 'unpause', 'playtop', 'pt', 'ptop', 'queue', 'q', 'search', 'playsearch', 'ps', 'volume', 'v', 'vol'],
	cooldown: 5,
	async execute(message, args, client) {
		try {
			const Embed = new EmbedBuilder()
				.setColor('Random')
				.setDescription('Music has been removed due to the Discord and Youtube Terms of Service.')
				.addFields([{ name: 'WHAT NOW?', value: 'Use the `Watch Together` activity built into Discord. It\'s more convenient, easier to use, faster, and you don\'t have to deal with commands.' }])
				.addFields([{ name: 'Don\'t have Activities feature yet?', value: 'Use the `Cactie Music` bot to listen to music until Discord adds the feature to your device/account. [Click Here](https://discord.com/api/oauth2/authorize?client_id=1037611758858272809&permissions=328602086464&scope=applications.commands%20bot) to invite the bot!' }]);
			message.reply({ embeds: [Embed] });
		}
		catch (err) { client.error(err, message); }
	},
};
