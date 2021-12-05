const { WebSocketServer } = require('ws');
const { wsport } = require('../config/bot.json');
module.exports = client => {
	if (!wsport) return client.logger.info('Skipped websocket server loading!');
	const wss = new WebSocketServer({ port: wsport });
	client.logger.info(`Websocket server loaded on port ${wsport}`);
	wss.on('connection', function connection(ws) {
		ws.on('message', function message(data) {
			if (`${data}` === 'send me music info bitch') {
				const players = [];
				client.manager.players.forEach(player => {
					const playerjson = {
						options: player.options,
						queue: player.queue,
						current: player.queue.current,
						trackRepeat: player.trackRepeat,
						queueRepeat: player.queueRepeat,
						position: player.position,
						playing: player.playing,
						paused: player.paused,
						volume: player.volume,
					};
					players.push(playerjson);
				});
				ws.send(JSON.stringify(players));
			}
		});
	});
};