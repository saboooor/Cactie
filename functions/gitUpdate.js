const { NodeactylClient } = require('nodeactyl');
const servers = require('../config/pterodactyl.json');
const fs = require('fs');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = async function gitUpdate(client, message) {
	// get embed and check if it's an embed in the git channel
	const embed = message.embeds[0];
	if (!message.webhookId || !message.channel.id == '812082273393704960' || !embed || !embed.title) return;

	// get the server name from pterodactyl.json and branch name from embed title and check if it's this bot
	let server = null;
	if (embed.title.startsWith('[Pup:master]') && servers['pup'].client) server = servers['pup'];
	else if (embed.title.startsWith('[Pup:dev]') && servers['pup dev'].client) server = servers['pup dev'];
	if (!server || !server.client) return;

	// send a notice to everyone currently playing music and log and save music queues
	client.logger.info('Detected a new commit on GitHub, updating...');
	embed.setAuthor({ name: 'Pup is updating! Sorry for the inconvenience!' })
		.setFooter({ text: 'I\'ll be back up in a few seconds to keep your music playing!' });
	await client.manager.players.forEach(async player => {
		await client.guilds.cache.get(player.guild).channels.cache.get(player.textChannel).send({ embeds: [embed] });
		player.queue.unshift(player.queue.current);
		const playerjson = {
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
		const prevlines = fs.readFileSync('playercache.txt');
		fs.writeFileSync('playercache.txt', `${prevlines}\n${JSON.stringify(playerjson)}`);
		player.destroy();
	});

	// wait 5sec and restart the bot
	await sleep(5000);
	const Client = new NodeactylClient(server.url, server.apikey);
	await Client.restartServer(server.id);
};