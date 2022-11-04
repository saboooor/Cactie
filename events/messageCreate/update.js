const { EmbedBuilder } = require('discord.js');

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

	logger.info('Detected a new commit on GitHub, updating...');
	process.exit(1);
};