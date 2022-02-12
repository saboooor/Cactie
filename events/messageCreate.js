const { MessageAttachment, Embed, Collection, ButtonComponent, ButtonStyle, ActionRow } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
const { createPaste } = require('hastebin');
const gitUpdate = require('../functions/gitUpdate');
function clean(text) {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
const msg = require('../lang/en/msg.json');
module.exports = async (client, message) => {
	// Check if message is from a bot and if so return and also check if message is a github update
	if (message.author.bot) return await gitUpdate(client, message);

	// If channel is DM,send the dm to the dms channel
	if (message.channel.type == 'DM') {
		const files = [];
		for (const attachment of message.attachments) {
			const response = await fetch(attachment[1].url, { method: 'GET' });
			const arrayBuffer = await response.arrayBuffer();
			const img = new MessageAttachment(Buffer.from(arrayBuffer), attachment[1].name);
			files.push(img);
		}
		return client.guilds.cache.get('811354612547190794').channels.cache.get('849453797809455125').send({ content: `**${message.author}** > ${message.content}`, files: files });
	}

	// If the bot can't read message history or send messages, don't execute a command
	if (!message.guild.me.permissionsIn(message.channel).has('SEND_MESSAGES')
	|| !message.guild.me.permissionsIn(message.channel).has('READ_MESSAGE_HISTORY')) return;

	// make a custom function to replace message.reply
	// this is to send the message to the channel without a reply if reply fails
	message.msgreply = message.reply;
	message.reply = function reply(object) {
		return message.msgreply(object).catch(err => {
			client.logger.warn(err);
			return message.channel.send(object).catch(err => {
				client.logger.error(err);
			});
		});
	};

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

	// Check if reaction keywords are in message, if so, react
	client.reactions.forEach(reaction => {
		if ((srvconfig.reactions != 'false' || reaction.private)
		&& reaction.triggers.some(word => message.content.toLowerCase().includes(word))
		&& (reaction.additionaltriggers ? reaction.additionaltriggers.some(word => message.content.toLowerCase().includes(word)) : true)) {
			reaction.execute(message);
			client.logger.info(`${message.author.tag} triggered reaction: ${reaction.name}, in ${message.guild.name}`);
		}
	});

	// If message has the bot's Id, reply with prefix
	try {
		if (message.content.includes(client.user.id)) {
			const prefix = await message.reply({ content: `My prefix is \`${srvconfig.prefix}\`` });
			setTimeout(() => { prefix.delete(); }, 10000);
		}
	}
	catch (err) {
		client.logger.error(err);
	}

	// If message shortener is set and is smaller than the amount of lines in the message, delete the message and move the message into bin.birdflop.com
	if (message.content.split('\n').length > srvconfig.msgshortener && srvconfig.msgshortener != '0') {
		message.delete();
		const link = await createPaste(message.content, { server: 'https://bin.birdflop.com' });
		const shortEmbed = new Embed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Shortened long message')
			.setAuthor({ name: message.member.displayName, iconURL: message.member.user.avatarURL({ dynamic : true }) })
			.setDescription(link)
			.setFooter({ text: 'Next time please use a paste service for long messages' });
		message.channel.send({ embeds: [shortEmbed] });
	}

	// If message doesn't start with the prefix, if so, return
	// Also unresolve the ticket if channel is a resolved ticket
	if (!message.content.startsWith(srvconfig.prefix)) {
		// Check if channel is a ticket
		const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
		if (ticketData && ticketData.resolved == 'true') {
			await client.setData('ticketdata', 'channelId', message.channel.id, 'resolved', 'false');
			client.logger.info(`Unresolved #${message.channel.name}`);
		}
		return;
	}

	// Get args by splitting the message by the spaces and getting rid of the prefix
	const args = message.content.slice(srvconfig.prefix.length).trim().split(/ +/);

	// Get the command name from the fist arg and get rid of the first arg
	const commandName = args.shift().toLowerCase();

	// Get the command from the commandName, if it doesn't exist, return
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command || !command.name) return;

	// Start typing (basically to mimic the defer of interactions)
	await message.channel.sendTyping();

	// Get cooldowns and check if cooldown exists, if not, create it
	const { cooldowns } = client;
	if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

	// Get current timestamp and the command's last used timestamps
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);

	// Calculate the cooldown in milliseconds (default is 3600 miliseconds, idk why)
	const cooldownAmount = (command.cooldown || 3) * 1200;

	// Check if user is in the last used timestamp
	if (timestamps.has(message.author.id)) {
		// Get a random cooldown message
		const messages = require('../lang/en/cooldown.json');
		const random = Math.floor(Math.random() * messages.length);

		// Get cooldown expiration timestamp
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		// If cooldown expiration hasn't passed, send cooldown message and if the cooldown is less than 1200ms, react instead
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			if ((expirationTime - now) < 1200) return message.react('⏱️').catch(e => { client.logger.error(e); });
			const cooldownEmbed = new Embed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTitle(messages[random])
				.setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
			return message.reply({ embeds: [cooldownEmbed] });
		}
	}

	// Set last used timestamp to now for user and delete the timestamp after cooldown passes
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	// Check if args are required and see if args are there, if not, send error
	if (command.args && args.length < 1) {
		const Usage = new Embed()
			.setColor(0x5662f6)
			.setTitle('Usage')
			.setDescription(`\`${srvconfig.prefix + command.name + ' ' + command.usage}\``);
		if (command.similarcmds) Usage.setFooter({ text: `Did you mean to use ${srvconfig.prefix}${command.similarcmds}?` });
		return message.reply({ embeds: [Usage] });
	}

	// Create Error Embed
	const errEmbed = new Embed()
		.setColor(0xE74C3C);

	// Check if command can be ran only if the user voted since the past 24 hours
	if (command.voteOnly && client.user.id == '765287593762881616') {
		// Get vote data for user
		const vote = await client.getData('lastvoted', 'userId', message.author.id);

		// If user has not voted since the past 24 hours, send error message with vote buttons
		if (Date.now() > vote.timestamp + 86400000) {
			errEmbed.setTitle(`You need to vote to use ${command.name}! Vote below!`)
				.setDescription('Voting helps us get Pup in more servers!\nIt\'ll only take a few seconds!');
			const row = new ActionRow()
				.addComponents(
					new ButtonComponent()
						.setURL('https://top.gg/bot/765287593762881616/vote')
						.setLabel('top.gg')
						.setStyle(ButtonStyle.Link),
				)
				.addComponents(
					new ButtonComponent()
						.setURL('https://discordbotlist.com/bots/pup/upvote')
						.setLabel('dbl.com')
						.setStyle(ButtonStyle.Link),
				);
			return message.reply({ embeds: [errEmbed], components: [row] });
		}
	}

	// Check if user has the permissions necessary to use the command
	if (command.permission) {
		client.logger.info(JSON.stringify(message.member.permissions));
		client.logger.info(command.permission);
	}
	if (command.permission && (!message.member.permissions || (!message.member.permissions.has(command.permission) && !message.member.permissionsIn(message.channel).has(command.permission) && !message.member.roles.cache.has(srvconfig.adminrole)))) {
		if (command.permission == 'ADMINISTRATOR' && srvconfig.adminrole != 'permission') {
			client.logger.error(`User is missing ${command.permission} permission (${srvconfig.adminrole}) from -${command.name} in #${message.channel.name} at ${message.guild.name}`);
			errEmbed.setTitle(msg.rolereq.replace('-r', message.guild.roles.cache.get(srvconfig.adminrole).name));
			return message.reply({ embeds: [errEmbed] });
		}
		else {
			client.logger.error(`User is missing ${command.permission} permission from -${command.name} in #${message.channel.name} at ${message.guild.name}`);
			errEmbed.setTitle(msg.permreq.replace('-p', command.permission));
			return message.reply({ embeds: [errEmbed] });
		}
	}

	// Check if bot has the permissions necessary to run the command
	if (command.botperm && (!message.guild.me.permissions || (!message.guild.me.permissions.has(command.botperm) && !message.guild.me.permissionsIn(message.channel).has(command.botperm)))) {
		client.logger.error(`Bot is missing ${command.botperm} permission from /${command.name} in #${message.channel.name} at ${message.guild.name}`);
		errEmbed.setTitle(`I don't have the ${command.botperm} permission!`);
		return message.reply({ embeds: [errEmbed] });
	}

	// Get player for music checks
	const player = client.manager.get(message.guild.id);

	// Check if player exists and command needs it
	if (command.player && (!player || !player.queue.current)) {
		errEmbed.setTitle('There is no music playing.');
		return message.reply({ embeds: [errEmbed] });
	}

	// Check if bot is server muted and command needs unmute
	if (command.serverUnmute && message.guild.me.voice.serverMute) {
		errEmbed.setTitle('I\'m server muted!');
		return message.reply({ embeds: [errEmbed] });
	}

	// Check if user is in vc and command needs user to be in vc
	if (command.inVoiceChannel && !message.member.voice.channel) {
		errEmbed.setTitle('You must be in a voice channel!');
		return message.reply({ embeds: [errEmbed] });
	}

	// Check if user is in the same vc as bot and command needs it
	if (command.sameVoiceChannel && message.member.voice.channel !== message.guild.me.voice.channel) {
		errEmbed.setTitle(`You must be in the same channel as ${client.user}!`);
		return message.reply({ embeds: [errEmbed] });
	}

	// Check if user has dj role and command needs user to have it
	if (command.djRole && srvconfig.djrole != 'false') {
		// Get dj role, if it doesn't exist, send error message because invalid setting value
		const role = message.guild.roles.cache.get(srvconfig.djrole);
		if (!role) return message.reply({ content: msg.dj.notfound });

		// Check if user has role, if not, send error message
		if (!message.member.roles.cache.has(srvconfig.djrole)) {
			errEmbed.setTitle(msg.rolereq.replace('-r', role.name));
			return message.reply({ embeds: [errEmbed] });
		}
	}

	// execute the command
	try {
		client.logger.info(`${message.author.tag} issued dash command: ${message.content}, in ${message.guild.name}`);
		command.execute(message, args, client);
	}
	catch (err) {
		const interactionFailed = new Embed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('INTERACTION FAILED')
			.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic : true }) })
			.addField({ name: '**Type:**', value: 'Dash' })
			.addField({ name: '**Guild:**', value: message.guild.name })
			.addField({ name: '**Channel:**', value: message.channel.name })
			.addField({ name: '**INTERACTION:**', value: srvconfig.prefix + command.name })
			.addField({ name: '**Error:**', value: `${clean(err)}` });
		client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
		message.author.send({ embeds: [interactionFailed] }).catch(e => { client.logger.warn(e); });
		client.logger.error(err);
	}
};