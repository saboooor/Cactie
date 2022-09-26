const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'nsfwgifs',
	description: 'r/FutanariGifs, r/HENTAI_GIF, r/lesbians, r/Lesbian_gifs, r/lesbianOral, r/oppai_gif, r/FingeringHerself, r/Fingering, r/FingeringFever, r/TittyDrop, r/tittyfuck, r/trapgifs',
	async execute(message, args, client) {
		try {
			redditFetch(['FutanariGifs', 'HENTAI_GIF', 'lesbians', 'Lesbian_gifs', 'lesbianOral', 'oppai_gif', 'FingeringHerself', 'Fingering', 'FingeringFever', 'TittyDrop', 'tittyfuck', 'trapgifs'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};