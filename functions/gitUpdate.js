const { NodeactylClient } = require('nodeactyl');
const servers = require('../config/pterodactyl.json');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = async function gitUpdate(client, message) {
	// get embed and check if it's an embed in the git channel
	const embed = message.embeds[0];
	if (!message.webhookId || !message.channel.id == '812082273393704960' || !embed) return;

	// get the server name from pterodactyl.json and branch name from embed title and check if it's this bot
	let server = null;
	if (embed.title.startsWith('[Pup:master]') && servers['pup'].client) server = servers['pup'];
	else if (embed.title.startsWith('[Pup:dev]') && servers['pup dev'].client) server = servers['pup dev'];
	if (!server || !server.client) return;

	// send a notice to everyone currently playing music
	await client.manager.players.forEach(async player => {
		embed.setAuthor({ name: 'Pup is updating and will restart in 5sec! Sorry for the inconvenience!' })
			.setFooter({ text: 'You\'ll be able to play music again in about 10sec!' });
		await client.channels.cache.get(player.textChannel).send({ embeds: [embed] });
	});

	// wait 5sec and restart the bot
	await sleep(5000);
	const Client = new NodeactylClient(server.url, server.apikey);
	await Client.restartServer(server.id);
};