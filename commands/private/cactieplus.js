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
				.setDescription('**CACTIE PLUS**')
				.addFields([
					{
						name: 'Where\'s Music?',
						value: 'Music commands aren\'t allowed on verified Discord bots due to YouTube\'s Terms of Service, therefore also not allowed on the main Cactie bot. Music commands have been moved to a separate bot.',
					},
					{
						name: 'Where\'s NSFW?',
						value: 'NSFW commands aren\'t allowed on the App Directory, therefore also not allowed on the main Cactie bot. NSFW commands have been moved to a separate bot.',
					},
					{
						name: 'Cactie Plus',
						value: 'To access NSFW and Music, [add Cactie Plus to your server by clicking here](https://canary.smhsmh.club/plus)',
					},
				]);
			message.reply({ embeds: [Embed] });
		}
		catch (err) { client.error(err, message); }
	},
};
