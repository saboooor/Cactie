function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { createAudioResource, getVoiceConnection, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { createPaste } = require('hastebin');
const { TrackUtils } = require('erela.js');
const googleTTS = require('google-tts-api');
const resources = {};
module.exports = {
	name: 'tts',
	description: 'Text to speech into voice channel',
	usage: '<Text>',
	args: true,
	invc: true,
	samevc: true,
	options: require('../../options/text.js'),
	async execute(message, args, client) {
		try {
			const player = client.manager.get(message.guild.id);
			const channel = message.member.voice.channel;
			let playerjson;
			if (player) {
				player.queue.unshift(player.queue.current);
				const { textChannel, queue, trackRepeat, queueRepeat, position, paused, volume } = player;
				playerjson = {
					voiceChannel: player.options.voiceChannel,
					guild: player.guild,
					textChannel, queue, trackRepeat, queueRepeat, position, paused, volume,
				};
				if (player.nowPlayingMessage) player.nowPlayingMessage.delete().catch(err => client.logger.error(err.stack));
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

			const urls = googleTTS.getAllAudioUrls(args.join(' '));
			let play = true;
			if (!resources[channel.guild.id]) resources[channel.guild.id] = [];
			else play = false;
			urls.forEach(url => resources[channel.guild.id].push(createAudioResource(url.url)));
			if (!play) return;
			let counter = 0;
			const ttsplayer = createAudioPlayer();
			ttsplayer.play(resources[channel.guild.id][counter]);
			connection.subscribe(ttsplayer);
			const short = await createPaste(args.join(' '), { server: 'https://bin.birdflop.com' });
			if (message.commandName) message.reply({ content: `**Playing text to speech message:${resources[channel.guild.id].length > 1 ? ` (Part 1 of ${resources[channel.guild.id].length})` : ''}**\n${args.join(' ').length > 1024 ? short : `\`\`\`\n${args.join(' ')}\n\`\`\``}` });

			ttsplayer.on(AudioPlayerStatus.Idle, async () => {
				counter++;
				if (!resources[channel.guild.id][counter]) return delete resources[channel.guild.id];
				const res = resources[channel.guild.id];
				ttsplayer.play(res[counter]);
				if (message.commandName) message.reply({ content: `**Playing text to speech message:${res.length > 1 ? ` (Part ${counter + 1} of ${res.length})` : ''}**\n${args.join(' ').length > 1024 ? short : `\`\`\`\n${args.join(' ')}\n\`\`\``}` });
			});

			connection.on(VoiceConnectionStatus.Destroyed, async () => {
				if (message.commandName) message.reply({ content: `**Finished playing text to speech message!**\n${args.join(' ').length > 1024 ? short : `\`\`\`\n${args.join(' ')}\n\`\`\``}` });
				if (playerjson) {
					await sleep(250);
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
							track.colors = queueitem.colors;
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