const LastFM = require('last-fm');
const { LastFMKey } = require('../../config/music.json');
const lastfm = new LastFM(LastFMKey, { userAgent: 'Cactie/2.0.0 (https://cactie.smhsmh.club)' });
module.exports = async function getlfmCover(title, author) {
	return new Promise((resolve, reject) => {
		lastfm.trackInfo({ name: title, artistName: author }, async (err, data) => {
			if (err) reject(err);
			else if (data.images && data.images[data.images.length - 1]) resolve(data.images[data.images.length - 1]);
			resolve(undefined);
		});
	});
};