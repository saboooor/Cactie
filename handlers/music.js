const { Manager, Structure } = require('@phamleduy04/erela.js');
const compressEmbed = require('../functions/compressEmbed.js');
const fs = require('fs');
const YAML = require('yaml');
const { music } = YAML.parse(fs.readFileSync('./config.yml', 'utf8'));
const { refresh } = require('../lang/int/emoji.json');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const queuerow = new ActionRowBuilder()
	.addComponents([
		new ButtonBuilder()
			.setCustomId('music_playnext')
			.setEmoji({ id: refresh })
			.setLabel('Replay Song')
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId('music_playlast')
			.setLabel('Re-add to queue')
			.setStyle(ButtonStyle.Secondary),
	]);
module.exports = client => {
	Structure.extend(
		'Player',
		(Player) =>
			class extends Player {
				setNowplayingMessage(message) {
					if (this.nowPlayingMessage && this.nowPlayingMessage.embeds.length) {
						const NPEmbed = new EmbedBuilder(this.nowPlayingMessage.embeds[0].toJSON());
						const row = NPEmbed.toJSON().description.startsWith('<:play:948091865977196554> ') ? [queuerow] : [];
						this.nowPlayingMessage.edit({ embeds: [compressEmbed(NPEmbed)], components: row }).catch(err => logger.error(err.stack));
					}
					return this.nowPlayingMessage = message;
				}
			},
	);
	client.manager = new Manager({
		nodes: [music.lavalink],
		send: (id, payload) => {
			const guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
		autoPlay: true,
	});
	client.on('raw', (d) => client.manager.updateVoiceState(d));
	fs.readdir('./events/music/', (err, files) => {
		if (err) return logger.error(err.stack);
		// go through all the files in the events/music folder and register them
		let amount = 0;
		files.forEach(file => {
			if (!file.endsWith('.js')) return;
			const event = require(`../events/music/${file}`);
			const eventName = file.split('.')[0];
			client.manager.on(eventName, event.bind(null, client));
			amount = amount + 1;
		});
		logger.info(`${amount} lavalink event listeners loaded`);
	});
	logger.info('Music handler loaded');
};