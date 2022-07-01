const { WebSocketServer } = require('ws');
const fs = require('fs');
const YAML = require('yaml');
const { con } = YAML.parse(fs.readFileSync('./config.yml', 'utf8'));
module.exports = client => {
	if (!con.websocket) return client.logger.info('Skipped websocket server loading!');
	const wss = new WebSocketServer({ port: con.websocket });
	client.logger.info(`Websocket server loaded on port ${con.websocket}`);
	wss.on('connection', async function connection(ws, req) {
		const userId = req.url.split('=')[1];

		let player;
		let guild;
		let member;

		client.manager.players.forEach(async p => {
			guild = client.guilds.cache.get(p.guild);
			member = guild.members.cache.get(userId);
			if (member && member.voice && member.voice.channel && member.voice.channel.id == p.options.voiceChannel) player = p;
		});

		if (!player) return ws.send(JSON.stringify({ type: 'error', message: `Player not found!\nPlay some music with ${client.user.username} first!` }));
		if (!guild.channels.cache.get(player.options.voiceChannel)) return ws.send(JSON.stringify({ type: 'error', message: `Player not found!\nPlay some music with ${client.user.username} first!` }));
		player.websockets ? player.websockets.push(ws) : player.websockets = [ws];
		const { paused, position, queue } = player;
		const srvconfig = await client.getData('settings', 'guildId', player.guild);
		const role = guild.roles.cache.get(srvconfig.djrole);

		ws.send(JSON.stringify({
			type: 'info',
			player: {
				...player.options,
				voiceChannel: `#${guild.channels.cache.get(player.options.voiceChannel).name}`,
				hasdj: srvconfig.djrole == 'false' ? true : member.roles.cache.has(srvconfig.djrole),
				djrole: role ? role.name : null,
			},
		}));

		ws.send(JSON.stringify({
			type: 'volume',
			volume: player.volume,
		}));

		if (queue && queue.current) {
			ws.send(JSON.stringify({
				type: 'track',
				current: queue.current,
				queue,
			}));
			ws.send(JSON.stringify({
				type: 'playing',
				paused,
			}));
			ws.send(JSON.stringify({
				type: 'progress',
				max: queue.current.duration,
				pos: position,
			}));
		}

		ws.on('message', async function message(data) {
			const json = JSON.parse(`${data}`);
			if (json.req == 'shuffle') {
				await player.queue.shuffle();
				player.websockets.forEach(playerws => {
					playerws.send(JSON.stringify({
						type: 'track',
						current: queue.current,
						queue,
					}));
				});
			}
			if (json.req == 'toggleplay') {
				await player.pause(!player.paused);
				player.websockets.forEach(playerws => {
					playerws.send(JSON.stringify({
						type: 'playing',
						paused: player.paused,
					}));
				});
			}
			if (json.req == 'skip') {
				if (json.amount) await player.queue.remove(0, json.amount);
				await player.stop();
			}
			if (json.req == 'volume') {
				await player.setVolume(json.volume);
				player.websockets.forEach(playerws => {
					if (playerws == ws) return;
					playerws.send(JSON.stringify({
						type: 'volume',
						volume: player.volume,
					}));
				});
			}
			if (json.req == 'seek') await player.seek(json.time);
		});

		ws.on('close', async function close() {
			player.websockets.splice(player.websockets.indexOf(ws), 1);
		});
	});
};