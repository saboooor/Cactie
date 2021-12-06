const { WebSocketServer } = require('ws');
const { wsport } = require('../config/bot.json');
module.exports = client => {
	if (!wsport) return client.logger.info('Skipped websocket server loading!');
	const wss = new WebSocketServer({ port: wsport });
	client.logger.info(`Websocket server loaded on port ${wsport}`);
	wss.on('connection', function connection(ws) {
		ws.on('message', function message(data) {
			if (`${data}`.startsWith('music info for:')) {
				const userid = `${data}`.replace('music info for: ', '');
				const players = [];
				client.manager.players.forEach(player => {
					const guild = client.guilds.cache.get(player.guild);
					const member = guild.members.cache.get(userid);
					if (member && member.voice && member.voice.channel.id === player.options.voiceChannel) {
						const playerjson = {
							voiceChannelId: player.options.voiceChannel,
							voiceChannelName: `#${client.channels.cache.get(player.options.voiceChannel).name}`,
							guild: player.guild,
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
					}
				});
				ws.send(JSON.stringify(players[0]));
			}
			else if (`${data}`.startsWith('volume change:')) {
				const userid = `${data}`.replace('volume change: ', '').split(' / ')[0];
				const newVolume = `${data}`.replace('volume change: ', '').split(' / ')[1];
				client.manager.players.forEach(player => {
					const guild = client.guilds.cache.get(player.guild);
					const member = guild.members.cache.get(userid);
					if (member && member.voice && member.voice.channel.id === player.options.voiceChannel) player.setVolume(newVolume);
				});
			}
			else if (`${data}`.startsWith('seek song:')) {
				const userid = `${data}`.replace('seek song: ', '').split(' / ')[0];
				const seek = `${data}`.replace('seek song: ', '').split(' / ')[1];
				client.manager.players.forEach(player => {
					const guild = client.guilds.cache.get(player.guild);
					const member = guild.members.cache.get(userid);
					if (member && member.voice && member.voice.channel.id === player.options.voiceChannel) player.seek(seek);
				});
			}
			else if (`${data}`.startsWith('playpause:')) {
				const userid = `${data}`.replace('playpause: ', '');
				client.manager.players.forEach(player => {
					const guild = client.guilds.cache.get(player.guild);
					const member = guild.members.cache.get(userid);
					if (member && member.voice && member.voice.channel.id === player.options.voiceChannel) {
						if (!player.paused) player.pause(true);
						else player.pause(false);
					}
				});
			}
			else if (`${data}`.startsWith('skip song:')) {
				const userid = `${data}`.replace('skip song: ', '');
				client.manager.players.forEach(player => {
					const guild = client.guilds.cache.get(player.guild);
					const member = guild.members.cache.get(userid);
					if (member && member.voice && member.voice.channel.id === player.options.voiceChannel) player.stop();
				});
			}
		});
	});
};