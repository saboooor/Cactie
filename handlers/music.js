const { Manager } = require('erela.js');
const Spotify = require('erela.js-spotify');
const Deezer = require('erela.js-deezer');
const { nodes, SpotifyID, SpotifySecret } = require('../config/music.json');
const fs = require('fs');
module.exports = client => {
	client.manager = new Manager({
		nodes: nodes,
		send: (id, payload) => {
			const guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
		autoPlay: true,
		plugins: [new Spotify({
			clientID: SpotifyID,
			clientSecret: SpotifySecret,
		}),
		new Deezer(),
		],
	});
	client.on('raw', (d) => client.manager.updateVoiceState(d));
	fs.readdir('./events/music/', (err, files) => {
		if (err) return client.logger.error(err);
		files.forEach(file => {
			if (!file.endsWith('.js')) return;
			const event = require(`../events/music/${file}`);
			const eventName = file.split('.')[0];
			client.manager.on(eventName, event.bind(null, client));
		});
		// goes through all the files in the events folder and registers them
	});
};