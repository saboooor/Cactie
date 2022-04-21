module.exports = async (client, message) => {
	// Check if message is from a bot and if so return
	if (message.createdById == client.user.id) return;

	// Get current settings for the guild
	const srvconfig = {
		prefix: '*',
		language: 'English',
		reactions: 'true',
	};

	// Get the language for the user if specified or guild language
	let lang = require(`../../lang/${srvconfig.language}/msg.json`);
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${message.createdById}'`);
	if (data[0]) lang = require(`../../lang/${data[0].language}/msg.json`);

	// Check if reaction keywords are in message, if so, react
	client.reactions.forEach(reaction => {
		if ((srvconfig.reactions != 'false' || reaction.private)
		&& reaction.triggers.some(word => message.content.toLowerCase().includes(word))
		&& (reaction.additionaltriggers ? reaction.additionaltriggers.some(word => message.content.toLowerCase().includes(word)) : true)) {
			reaction.execute(message);
			client.logger.info(`${message.createdById} triggered reaction: ${reaction.name}`);
		}
	});

	// Use mention as prefix instead of prefix too
	if (message.content.startsWith(`@${client.user.name}`)) {
		srvconfig.txtprefix = srvconfig.prefix;
		srvconfig.prefix = `@${client.user.name}`;
	}

	// If message doesn't start with the prefix, return
	// Also unresolve the ticket if channel is a resolved ticket
	if (!message.content.startsWith(srvconfig.prefix)) {
		// If message has the bot's Id, reply with prefix
		if (message.content.includes(`@${client.user.name}`)) {
			message.reply(lang.prefix.replace(/\n/g, '\n\n').replace('{pfx}', srvconfig.txtprefix ? srvconfig.txtprefix : srvconfig.prefix).replace('{usr}', `@${client.user.name}`));
		}
		return;
	}
};