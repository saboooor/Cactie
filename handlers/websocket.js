const { WebSocketServer } = require('ws');
const { wsport } = require('../config/bot.json');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = client => {
	if (!wsport) return client.logger.info('Skipped websocket server loading!');
	const wss = new WebSocketServer({ port: wsport });
	client.logger.info(`Websocket server loaded on port ${wsport}`);
	wss.on('connection', function connection(ws) {
		ws.on('message', async function message(data) {
			if (`${data}`.startsWith('music info for:')) {
				const userid = `${data}`.replace('music info for: ', '');
				await client.manager.players.forEach(async player => {
					const guild = await client.guilds.cache.get(player.guild);
					const member = await guild.members.cache.get(userid);
					const srvconfig = await client.getData('settings', 'guildId', player.guild);
					const role = guild.roles.cache.get(srvconfig.djrole);
					if (member && member.voice && member.voice.channel && member.voice.channel.id === player.options.voiceChannel) {
						const playerjson = {
							voiceChannelId: player.options.voiceChannel,
							voiceChannelName: guild.channels.cache.get(player.options.voiceChannel).name,
							guild: player.guild,
							queue: player.queue,
							current: player.queue.current,
							trackRepeat: player.trackRepeat,
							queueRepeat: player.queueRepeat,
							position: player.position,
							playing: player.playing,
							paused: player.paused,
							volume: player.volume,
							bands: player.bands,
							lyrics: player.lyrics,
							hasdj: srvconfig.djrole == 'false' ? true : member.roles.cache.has(srvconfig.djrole),
							djrole: role ? role.name : null,
						};
						if (!playerjson.hasdj && Math.floor((message.guild.me.voice.channel.members.size - 1) / 2) <= 1) playerjson.hasdj = true;
						ws.send(JSON.stringify(playerjson));
					}
				});
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
			else if (`${data}`.startsWith('skip to:')) {
				const userid = `${data}`.replace('skip to: ', '').split(' / ')[0];
				const index = `${data}`.replace('skip to: ', '').split(' / ')[1];
				client.manager.players.forEach(player => {
					const guild = client.guilds.cache.get(player.guild);
					const member = guild.members.cache.get(userid);
					if (member && member.voice && member.voice.channel.id === player.options.voiceChannel && index <= player.queue.length) {
						if (index != 0) player.queue.remove(0, index);
						player.stop();
					}
				});
			}
			else if (`${data}`.startsWith('shuffle queue:')) {
				const userid = `${data}`.replace('shuffle queue: ', '').split(' / ')[0];
				client.manager.players.forEach(player => {
					const guild = client.guilds.cache.get(player.guild);
					const member = guild.members.cache.get(userid);
					if (member && member.voice && member.voice.channel.id === player.options.voiceChannel) player.queue.shuffle();
				});
			}
			else if (`${data}`.startsWith('eq:')) {
				const userid = `${data}`.replace('eq: ', '').split(' / ')[0];
				let bands = `${data}`.replace('eq: ', '').split(' / ')[1].split(',');
				client.manager.players.forEach(async player => {
					const guild = client.guilds.cache.get(player.guild);
					const member = guild.members.cache.get(userid);
					if (member && member.voice && member.voice.channel.id === player.options.voiceChannel) {
						await player.clearEQ();
						await sleep(30);
						bands = [
							{ band: 0, gain: bands[0] },
							{ band: 1, gain: bands[1] },
							{ band: 2, gain: bands[2] },
							{ band: 3, gain: bands[3] },
							{ band: 4, gain: bands[4] },
							{ band: 5, gain: bands[5] },
							{ band: 6, gain: bands[6] },
							{ band: 7, gain: bands[7] },
							{ band: 8, gain: bands[8] },
							{ band: 9, gain: bands[9] },
							{ band: 10, gain: bands[10] },
							{ band: 11, gain: bands[11] },
							{ band: 12, gain: bands[12] },
							{ band: 13, gain: bands[13] },
							{ band: 14, gain: bands[14] },
						];
						await player.setEQ(...bands);
					}
				});
			}
		});
	});
};