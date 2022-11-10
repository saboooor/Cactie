const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'cactieplus',
	description: 'Music and NSFW commands have been moved to a separate bot. Do this command to learn more.',
	aliases: ['nowplaying', 'playing', 'np', 'play', 'p', 'pause', 'r', 'resume', 'unpause', 'playtop', 'pt', 'ptop', 'queue', 'q', 'search', 'playsearch', 'ps', 'volume', 'v', 'vol', 'blowjob', 'confused', 'confusedboner', 'cum', 'semen', 'dick', 'dicks', 'cock', 'cocks', 'penis', 'dilf', 'daddy', 'dilfs', 'femdom', 'furryporn', 'futanari', 'futa', 'gay', 'hentai', 'jackoff', 'stroke', 'stroking', 'lesbian', 'milf', 'mommmy', 'nsfwgifs', 'nudes', 'nude', 'oppai', 'petite', 'pussy', 'vagina', 'pussies', 'fingering', 'vaginas', 'r34', 'rule34', 'thick', 'thicc', 'curvy', 'thighs', 'thigh', 'tits', 'boob', 'boobs', 'boobies', 'tiddies', 'titty', 'trap', 'traps', 'femboy', 'femboys', 'yuri'],
	cooldown: 5,
	async execute(message, args, client) {
		try {
			if (message.guild.members.cache.get('1037611758858272809')) return;
			const Embed = new EmbedBuilder()
				.setColor('Random')
				.setDescription('Music and NSFW commands has been removed due to the Discord App Directory and Youtube Terms of Service.')
				.addFields([{ name: 'WHAT NOW?', value: 'Use the `Watch Together` activity built into Discord to listen to music. It\'s more convenient, easier to use, faster, and you don\'t have to deal with commands.' }])
				.addFields([{ name: 'WHAT ELSE?', value: 'Use the `Cactie Plus` bot to listen to music and use NSFW commands until Discord adds the feature to your device/account. [Click Here](https://cactie.smhsmh.club/plus) to invite the bot!' }]);
			message.reply({ embeds: [Embed] });
		}
		catch (err) { client.error(err, message); }
	},
};
