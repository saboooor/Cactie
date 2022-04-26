const { Collection } = require('discord.js');
module.exports = async (client, message) => {
	// Check if message is from a bot and if so return
	if (message.createdById == client.user.id) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', '!guilded');

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
			const prefix = await message.send({ content: `My prefix is \`${srvconfig.txtprefix ? srvconfig.txtprefix : srvconfig.prefix}\` You may also use my mention as a prefix.`, replyMessageIds: [message.id] });
			setTimeout(() => { message.client.messages.delete(prefix.channelId, prefix.id).catch(err => client.logger.error(err.stack)); }, 10000);
		}
		return;
	}

	// Get args by splitting the message by the spaces and getting rid of the prefix
	const args = message.content.slice(srvconfig.prefix.length).trim().split(/ +/);

	// Get the command name from the fist arg and get rid of the first arg
	const commandName = args.shift().toLowerCase();

	// Get the command from the commandName, if it doesn't exist, return
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command || !command.name) {
		// If message has the bot's Id, reply with prefix
		if (message.content.includes(`@${client.user.name}`)) {
			const prefix = await message.send({ content: `My prefix is \`${srvconfig.txtprefix ? srvconfig.txtprefix : srvconfig.prefix}\` You may also use my mention as a prefix.`, replyMessageIds: [message.id] });
			setTimeout(() => { message.client.messages.delete(prefix.channelId, prefix.id).catch(err => client.logger.error(err.stack)); }, 10000);
		}
		return;
	}

	// Get cooldowns and check if cooldown exists, if not, create it
	const { cooldowns } = client;
	if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

	// Get current timestamp and the command's last used timestamps
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);

	// Calculate the cooldown in milliseconds (default is 3600 miliseconds, idk why)
	const cooldownAmount = (command.cooldown || 3) * 1200;

	// Check if user is in the last used timestamp
	if (timestamps.has(message.createdById)) {
		// Get a random cooldown message
		const messages = require(`../../lang/${lang.language.name}/cooldown.json`);
		const random = Math.floor(Math.random() * messages.length);

		// Get cooldown expiration timestamp
		const expirationTime = timestamps.get(message.createdById) + cooldownAmount;

		// If cooldown expiration hasn't passed, send cooldown message and if the cooldown is less than 1200ms, react instead
		if (now < expirationTime && message.createdById != 'AYzRpEe4') {
			const timeLeft = (expirationTime - now) / 1000;
			if ((expirationTime - now) < 1200) return client.messages.addReaction(message.channelId, message.id, 90001737);
			const cooldownEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(messages[random])
				.setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
			return message.send({ embeds: [cooldownEmbed], replyMessageIds: [message.id] });
		}
	}

	// Set last used timestamp to now for user and delete the timestamp after cooldown passes
	timestamps.set(message.createdById, now);
	setTimeout(() => timestamps.delete(message.createdById), cooldownAmount);

	// execute the command
	try {
		client.logger.info(`${message.createdById} issued command: ${message.content}`);
		command.execute(message, args, client, lang);
	}
	catch (err) { client.logger.error(err.stack); }

};