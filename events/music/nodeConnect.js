const { TrackUtils } = require('erela.js');
const fs = require('fs');
module.exports = async (client, node) => {
	client.logger.info(`Node "${node.options.identifier}" connected`);
	if (!fs.existsSync('playercache.txt')) return;
	let data = fs.readFileSync('playercache.txt');
	data = data.toString().split('\n');
	data.splice(0, 1);
	data.forEach(async playerdata => {
		const playerjson = JSON.parse(playerdata);
		const player = client.manager.create({ ...playerjson, selfDeafen: true });
		if (player.state != 'CONNECTED') player.connect();
		playerjson.queue.forEach(async queueitem => {
			if (queueitem) {
				const trackjson = {
					track: queueitem.track,
					info: {
						identifier: queueitem.identifier,
						isSeekable: queueitem.isSeekable,
						author: queueitem.author,
						length: queueitem.duration,
						isStream: queueitem.isStream,
						title: queueitem.title,
						uri: queueitem.uri,
					},
				};
				const track = TrackUtils.build(trackjson);
				track.img = queueitem.img;
				track.colors = queueitem.colors;
				track.requester = client.guilds.cache.get(player.guild).members.cache.get(queueitem.requester.id).user;
				await player.queue.add(track);
			}
		});
		if (!player.playing && player.queue.current) await player.play();
		player.pause(playerjson.paused);
		player.seek(playerjson.position);
		player.setTrackRepeat(playerjson.trackRepeat);
		player.setQueueRepeat(playerjson.queueRepeat);
	});
	fs.writeFileSync('playercache.txt', '');
};