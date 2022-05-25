const LastFM = require('last-fm');
const fs = require('fs');
const YAML = require('yaml');
const { music } = YAML.parse(fs.readFileSync('./config.yml', 'utf8'));
const lastfm = new LastFM(music.lastfm, { userAgent: 'Cactie/2.0.0 (https://cactie.smhsmh.club)' });
module.exports = async function getCover(title, author, player) {
	return new Promise((resolve, reject) => {
		let img;
		lastfm.trackSearch({ q: title }, async (err, data) => {
			if (err) reject(err);
			data.result.forEach(result => {
				if (!author.toLowerCase().includes(result.artistName.toLowerCase()) || !result.images[0] || result.images[0].includes('2a96cbd8b46e442fc41c2b86b821562f')) return;
				if (!img) img = result.images.pop();
			});
			if (!img) {
				lastfm.albumSearch({ q: title }, async (alberr, albdata) => {
					if (alberr) reject(alberr);
					albdata.result.forEach(result => {
						if (!author.toLowerCase().includes(result.artistName.toLowerCase()) || !result.images[0] || result.images[0].includes('2a96cbd8b46e442fc41c2b86b821562f')) return;
						if (!img) img = result.images.pop();
					});
					if (!img) {
						const Searched = await player.search(`${title} ${author}`);
						const track = Searched.tracks[0];
						if (track && track.displayThumbnail) img = track.displayThumbnail('hqdefault');
					}
					resolve(img);
				});
			}
			else {
				resolve(img);
			}
		});
	});
};