const { EmbedBuilder } = require('discord.js');
const { existsSync, readFileSync, writeFileSync } = require('fs');

module.exports = async (client, message) => {
	// get embed and check if it's an embed in the git channel
	if (!message.webhookId || !message.author.bot || message.channel.id != '812082273393704960' || !message.embeds[0] || !message.embeds[0].toJSON().title) return;

	// Set the embed into a builder
	const GitEmbed = new EmbedBuilder(message.embeds[0].toJSON());

	// Check if the bot's branch is the right one
	let restart;
	if (GitEmbed.toJSON().title.startsWith('[Cactie:master]') && client.user.id == '848775888673439745') restart = true;
	else if (GitEmbed.toJSON().title.startsWith('[Cactie:dev]') && client.user.id == '765287593762881616') restart = true;
	if (!restart) return;

	// Check if all commits in message skip the update
	const commits = GitEmbed.toJSON().description.split('\n');
	let update = false;
	commits.forEach(commit => { if (!commit.split(') ')[1].startsWith('[skip]')) update = true; });
	if (!update) return;

	// send a notice to everyone currently playing music and log and save music queues
	logger.info('Detected a new commit on GitHub, updating...');
	GitEmbed.setAuthor({ name: `${client.user.username} is updating! Sorry for the inconvenience!` })
		.setFooter({ text: 'I\'ll be back up in a few seconds to keep your music playing!' });
	await client.manager.players.forEach(async player => {
		await client.guilds.cache.get(player.guild).channels.cache.get(player.textChannel).send({ embeds: [GitEmbed] });
		player.queue.unshift(player.queue.current);
		const { textChannel, queue, trackRepeat, queueRepeat, position, paused, volume, effects, effectcurrentonly } = player;
		const playerjson = {
			voiceChannel: player.options.voiceChannel,
			guild: player.guild,
			textChannel, queue, trackRepeat, queueRepeat, position, paused, volume, effects, effectcurrentonly,
		};
		const prevlines = readFileSync('playercache.txt');
		writeFileSync('playercache.txt', `${prevlines}\n${JSON.stringify(playerjson)}`);
		player.destroy();
	});

	// wait 1 sec and restart the bot
	await sleep(1000);
	process.exit(1);
};