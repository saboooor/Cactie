const { Collection } = require('discord.js');
const { Embed, UserType } = require('guilded.js');
module.exports = async (client, message) => {
	// Check if message is from a bot and if so return, and fetch member if not already fetched
	if (message.createdByBotId || message.createdByWebhookId || (!message.content && !message.embeds)) return;
	message.member = client.members.cache.get(`${message.serverId}:${message.createdById}`);
	if (!message.member) message.member = await client.members.fetch(message.serverId, message.createdById);
	if (message.member.user.type == UserType.Bot) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', message.serverId);

	// Get the language for the user if specified or guild language
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${message.createdById}'`);
	let lang = require('../../lang/English/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../lang/${srvconfig.language}/msg.json`);
	if (data[0]) lang = require(`../../lang/${data[0].language}/msg.json`);

	// Check if reaction keywords are in message, if so, react
	client.reactions.forEach(reaction => {
		if (srvconfig.reactions != 'false'
		&& reaction.triggers.some(word => message.content.toLowerCase().includes(word))
		&& (reaction.additionaltriggers ? reaction.additionaltriggers.some(word => message.content.toLowerCase().includes(word)) : true)) {
			reaction.execute(message);
			client.logger.info(`${message.member.user.name} triggered reaction: ${reaction.name}`);
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
			const prefix = await message.reply({ content: `My prefix is \`${srvconfig.txtprefix ? srvconfig.txtprefix : srvconfig.prefix}\` You may also use my mention as a prefix.` });
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
			const prefix = await message.reply({ content: `My prefix is \`${srvconfig.txtprefix ? srvconfig.txtprefix : srvconfig.prefix}\` You may also use my mention as a prefix.` });
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
			const cooldownEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(messages[random])
				.setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
			return message.reply({ embeds: [cooldownEmbed] });
		}
	}

	// Set last used timestamp to now for user and delete the timestamp after cooldown passes
	timestamps.set(message.createdById, now);
	setTimeout(() => timestamps.delete(message.createdById), cooldownAmount);

	// Check if args are required and see if args are there, if not, send error
	if (command.args && args.length < 1) {
		const Usage = new Embed()
			.setColor(0x2f3136)
			.setTitle('Usage')
			.setDescription(`\`${srvconfig.prefix + command.name + ' ' + command.usage}\``);
		if (command.similarcmds) Usage.setFooter(`Did you mean to use ${command.similarcmds}?`);
		return message.reply({ embeds: [Usage] });
	}

	// execute the command
	try {
		client.logger.info(`${message.member.user.name} issued command: ${message.content}`);
		command.execute(message, args, client, lang);
	}
	catch (err) { client.logger.error(err.stack); }

};