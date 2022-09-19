module.exports = async (client, message) => {
	// Check if author is a bot or message is in dm
	if (!message.guild || message.webhookId || message.author.bot) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', { guildId: message.guild.id });

	// Check if reaction keywords are in message, if so, react
	client.reactions.forEach(reaction => {
		if (srvconfig.reactions != 'false'
		&& reaction.triggers.some(word => message.content.toLowerCase().includes(word))
		&& (reaction.additionaltriggers ? reaction.additionaltriggers.some(word => message.content.toLowerCase().includes(word)) : true)) {
			reaction.execute(message);
			logger.info(`${message.author.tag} triggered reaction: ${reaction.name}, in ${message.guild.name}`);
		}
	});
};