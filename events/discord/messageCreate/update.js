const { NodeactylClient } = require('nodeactyl');
const { EmbedBuilder } = require('discord.js');
const servers = require('../../../config/pterodactyl.json');
const fs = require('fs');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = async (client, message) => {
	// get embed and check if it's an embed in the git channel
	if (!message.webhookId || !message.author.bot || message.channel.id != '812082273393704960' || !message.embeds[0] || !message.embeds[0].toJSON().title) return;

	// Set the embed into a builder
	const GitEmbed = new EmbedBuilder(message.embeds[0].toJSON());

	// get the server name from pterodactyl.json and branch name from embed title and check if it's this bot
	let server;
	if (GitEmbed.toJSON().title.startsWith('[Cactie:master]') && servers['pup'].client) server = servers['pup'];
	else if (GitEmbed.toJSON().title.startsWith('[Cactie:dev]') && servers['pup dev'].client) server = servers['pup dev'];
	if (!server || !server.client) return;

	// Check if all commits in message skip the update
	const commits = GitEmbed.toJSON().description.split('\n');
	let update = false;
	commits.forEach(commit => {
		if (!commit.split(') ')[1].startsWith('[skip]')) update = true;
	});
	if (!update) return;

	// send a notice to everyone currently playing music and log and save music queues
	client.logger.info('Detected a new commit on GitHub, updating...');
	GitEmbed.setAuthor({ name: `${client.user.username} is updating! Sorry for the inconvenience!` })
		.setFooter({ text: 'I\'ll be back up in a few seconds to keep your music playing!' });
	await client.manager.players.forEach(async player => {
		await client.guilds.cache.get(player.guild).channels.cache.get(player.textChannel).send({ embeds: [GitEmbed] });
		player.queue.unshift(player.queue.current);
		const { textChannel, queue, trackRepeat, queueRepeat, position, paused, volume } = player;
		const playerjson = {
			voiceChannel: player.options.voiceChannel,
			guild: player.guild,
			textChannel, queue, trackRepeat, queueRepeat, position, paused, volume,
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