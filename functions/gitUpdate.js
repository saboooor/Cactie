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
	if (embed.title.startsWith('[Cactie:master]') && servers['pup'].client) server = servers['pup'];
	else if (embed.title.startsWith('[Cactie:dev]') && servers['pup dev'].client) server = servers['pup dev'];
	if (!server || !server.client) return;

	// Check if all commits in message skip the update
	const commits = embed.description.split('\n');
	let update = false;
	commits.forEach(commit => {
		if (!commit.split(') ')[1].startsWith('[skip]')) update = true;
	});
	if (!update) return;

	// send a notice to everyone currently playing music and log and save music queues
	client.logger.info('Detected a new commit on GitHub, updating...');
	embed.setAuthor({ name: 'Cactie is updating! Sorry for the inconvenience!' })
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

	// wait 1 sec and restart the bot
	await sleep(1000);
	const Client = new NodeactylClient(server.url, server.apikey);
	await Client.restartServer(server.id);
};