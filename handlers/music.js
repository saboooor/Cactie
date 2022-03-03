const { Manager, Structure } = require('erela.js');
const { LavasfyClient } = require('lavasfy');
const { MessageEmbed } = require('discord.js');
const { nodes, SpotifyID, SpotifySecret } = require('../config/music.json');
const fs = require('fs');
module.exports = client => {
	Structure.extend(
		'Player',
		(Player) =>
			class extends Player {
				setNowplayingMessage(message) {
					if (this.nowPlayingMessage) {
						const lines = this.nowPlayingMessage.embeds[0].description.split('\n');
						const MiniNPEmbed = new MessageEmbed()
							.setDescription(`${lines[0]} ${lines[1]}${lines[2] ? ` - ${lines[2]}` : ''}`)
							.setColor(this.nowPlayingMessage.embeds[0].color);
						this.nowPlayingMessage.edit({ embeds: [MiniNPEmbed], components: [] }).catch(err => client.logger.error(err));
					}
					return this.nowPlayingMessage = message;
				}
			},
	);
	nodes.forEach(node => node.id = node.identifier);
	client.Lavasfy = new LavasfyClient(
		{
			clientID: SpotifyID,
			clientSecret: SpotifySecret,
			playlistPageLoadLimit: 4,
			filterAudioOnlyResult: true,
			autoResolve: true,
			useSpotifyMetadata: true,
		},
		nodes,
	);
	client.manager = new Manager({
		nodes: nodes,
		send: (id, payload) => {
			const guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
		autoPlay: true,
	});
	client.on('raw', (d) => client.manager.updateVoiceState(d));
	fs.readdir('./events/music/', (err, files) => {
		if (err) return client.logger.error(err);
		// go through all the files in the events/music folder and register them
		let amount = 0;
		files.forEach(file => {
			if (!file.endsWith('.js')) return;
			const event = require(`../events/music/${file}`);
			const eventName = file.split('.')[0];
			client.manager.on(eventName, event.bind(null, client));
			amount = amount + 1;
		});
		client.logger.info(`${amount} lavalink event listeners loaded`);
	});
	client.logger.info('Music handler loaded');
};