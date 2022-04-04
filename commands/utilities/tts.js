function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { createAudioResource, getVoiceConnection, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const { TrackUtils } = require('erela.js');
const googleTTS = require('google-tts-api');
const Stream = require('stream');
function getVoiceStream(text, { lang = 'en', slow = false, host = 'https://translate.google.com', timeout = 10000, splitPunct } = {}) {
	const stream = new Stream.PassThrough();

	googleTTS.getAudioBase64(text, { lang, slow, host, timeout, splitPunct })
		.then(base64Audio => base64toBinaryStream(base64Audio))
		.then(audioStream => audioStream.pipe(stream))
		.catch(console.error);

	return stream;
}
function base64toBinaryStream(base64Text) {
	const binary = Buffer.from(base64Text, 'base64').toString('binary');
	const buffer = new ArrayBuffer(binary.length);
	const bytes = new Uint8Array(buffer);

	let i = 0;

	const bytesLength = buffer.byteLength;
	for (i; i < bytesLength; i++) { bytes[i] = binary.charCodeAt(i) & 0xFF; }
	const stream = new Stream.PassThrough();

	stream.write(bytes, 'binary');
	return stream;
}
module.exports = {
	name: 'tts',
	description: 'Text to speech into voice channel',
	usage: '<Text>',
	args: true,
	invc: true,
	samevc: true,
	options: require('../options/text.json'),
	async execute(message, args, client) {
		try {
			const player = client.manager.get(message.guild.id);
			const channel = message.member.voice.channel;
			let playerjson = null;
			if (player) {
				player.queue.unshift(player.queue.current);
				playerjson = {
					voiceChannel: player.options.voiceChannel,
					textChannel: player.textChannel,
					guild: player.guild,
					queue: player.queue,
					trackRepeat: player.trackRepeat,
					queueRepeat: player.queueRepeat,
					position: player.position,
					volume: player.volume,
					paused: player.paused,
				};
				player.destroy();
			}

			let connection = getVoiceConnection(channel.guild.id);

			if (!connection || player) {
				connection = joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator,
				});
			}

			const ttsplayer = createAudioPlayer();

			const stream = getVoiceStream(args.join(' '), { lang: 'en', slow: false });

			const res = createAudioResource(stream, {
				inputType: StreamType.Arbitrary,
				inlineVolume:true,
			});

			ttsplayer.play(res);

			connection.subscribe(ttsplayer);

			ttsplayer.on(AudioPlayerStatus.Idle, async () => {
				connection.destroy();
				if (playerjson) {
					await sleep(500);
					const newplayer = await client.manager.create({
						guild: playerjson.guild,
						voiceChannel: playerjson.voiceChannel,
						textChannel: playerjson.textChannel,
						volume: playerjson.volume,
						selfDeafen: true,
					});
					if (newplayer.state != 'CONNECTED') await newplayer.connect();
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
							track.color = queueitem.color;
							track.requester = client.guilds.cache.get(newplayer.guild).members.cache.get(queueitem.requester.id).user;
							await newplayer.queue.add(track);
						}
					});
					if (!newplayer.playing && newplayer.queue.current) await newplayer.play();
					newplayer.seek(playerjson.position);
					newplayer.setVolume(playerjson.volume);
					newplayer.setTrackRepeat(playerjson.trackRepeat);
					newplayer.setQueueRepeat(playerjson.queueRepeat);
					newplayer.pause(playerjson.paused);
				}
			});
		}
		catch (err) { client.error(err, message); }
	},
};