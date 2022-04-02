const { EmbedBuilder, Collection, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');
module.exports = async (client, interaction) => {
	// Check if interaction is command
	if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

	// Get the command from the available slash cmds in the bot, if there isn't one, just return because discord will throw an error itself
	const command = client.slashcommands.get(interaction.commandName);
	if (!command) return;

	// Make args variable from interaction options for compatibility with dash command code
	// If command is context menu, set it to client instead since it's (interaction, client)
	const args = interaction.isContextMenuCommand() ? client : interaction.options._hoistedOptions;
	if (interaction.isContextMenuCommand()) {
		// Set message variable to the message of the context menu
		const msgs = await interaction.channel.messages.fetch({ around: interaction.targetId, limit: 1 });
		interaction.message = msgs.first();
	}
	else {
		// Set args to value of options
		args.forEach(arg => args[args.indexOf(arg)] = arg.value);

		// If subcommand exists, set the subcommand to args[0]
		if (interaction.options._subcommand) args.unshift(interaction.options._subcommand);
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
	if (timestamps.has(interaction.user.id)) {
		// Get a random cooldown message
		const messages = require(`../../lang/${interaction.lang.language.name}/cooldown.json`);
		const random = Math.floor(Math.random() * messages.length);

		// Get cooldown expiration timestamp
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		// If cooldown expiration hasn't passed, send cooldown message
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			const cooldownEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(messages[random])
				.setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
			return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
		}
	}

	// Set last used timestamp to now for user and delete the timestamp after cooldown passes
	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	// Check if slash command is being sent in a DM, if so, send error message because commands in DMs are stupid
	if (interaction.channel.isDM()) return client.error('You can\'t execute commands in DMs!', interaction, true);

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);

	// Get the language for the user if specified or guild language
	srvconfig.language = 'Uwu';
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${interaction.user.id}'`);
	if (data[0]) interaction.lang = require(`../../lang/${data[0].language}/msg.json`);
	else interaction.lang = require(`../../lang/${srvconfig.language}/msg.json`);

	// Check if command can be ran only if the user voted since the past 24 hours
	if (command.voteOnly && client.user.id == '848775888673439745') {
		// Get vote data for user
		const vote = await client.getData('lastvoted', 'userId', interaction.user.id);

		// If user has not voted since the past 24 hours, send error message with vote buttons
		if (Date.now() > vote.timestamp + 86400000) {
			const errEmbed = new EmbedBuilder().setTitle(`You need to vote to use ${command.name}! Vote below!`)
				.setDescription('Voting helps us get Cactie in more servers!\nIt\'ll only take a few seconds!');
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setURL('https://top.gg/bot/848775888673439745/vote')
						.setLabel('top.gg')
						.setStyle(ButtonStyle.Link),
				)
				.addComponents(
					new ButtonBuilder()
						.setURL('https://discordbotlist.com/bots/pup/upvote')
						.setLabel('dbl.com')
						.setStyle(ButtonStyle.Link),
				);
			return interaction.reply({ embeds: [errEmbed], components: [row] });
		}
	}

	// Check if user has the permissions necessary to use the command
	if (command.permission) {
		client.logger.info(JSON.stringify(interaction.member.permissions));
		client.logger.info(command.permission);
	}
	if (command.permission
		&& interaction.user.id !== '249638347306303499'
		&& (!interaction.member.permissions
			|| (!interaction.member.permissions.has(PermissionsBitField.Flags[command.permission])
				&& !interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags[command.permission])
				&& !interaction.member.roles.cache.has(srvconfig.adminrole)
			)
		)
	) {
		if (command.permission == 'Administrator' && srvconfig.adminrole != 'permission') {
			client.logger.error(`User is missing ${command.permission} permission (${srvconfig.adminrole}) from /${command.name} in #${interaction.channel.name} at ${interaction.guild.name}`);
			return client.error(interaction.lang.rolereq.replace('${role}', interaction.guild.roles.cache.get(srvconfig.adminrole).name), interaction, true);
		}
		else {
			client.logger.error(`User is missing ${command.permission} permission from /${command.name} in #${interaction.channel.name} at ${interaction.guild.name}`);
			return client.error(interaction.lang.permreq.replace('${perm}', command.permission), interaction, true);
		}
	}

	// Check if bot has the permissions necessary to run the command
	if (command.botperm && (!interaction.guild.me.permissions || (!interaction.guild.me.permissions.has(PermissionsBitField.Flags[command.botperm]) && !interaction.guild.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags[command.botperm])))) {
		client.logger.error(`Bot is missing ${command.botperm} permission from /${command.name} in #${interaction.channel.name} at ${interaction.guild.name}`);
		return client.error(`I don't have the ${command.botperm} permission!`, interaction, true);
	}

	// Get player for music checks
	const player = client.manager.get(interaction.guild.id);

	// Check if player exists and command needs it
	if (interaction.player && !player) return client.error('I\'m not in a voice channel!\nPlay some music before using this command!', interaction, true);

	// Check if player has any current song and command needs it
	if (interaction.playing && !player.queue.current) return client.error('I\'m not playing music!\nPlay some music before using this command!', interaction, true);

	// Check if bot is server muted and command needs unmute
	if (interaction.srvunmute && interaction.guild.me.voice.serverMute) return client.error('I\'m Server Muted!\nUnmute me before using this command!', interaction, true);

	// Check if user is in vc and command needs user to be in vc
	if (interaction.invc && !interaction.member.voice.channel) return client.error('You must be in a voice channel!\nJoin a voice channel before using this command!', interaction, true);

	// Check if user is in the same vc as bot and command needs it
	if (interaction.samevc && player && interaction.member.voice.channel.id != interaction.guild.me.voice.channel.id) return client.error(`You must be in the same channel as ${client.user.username} to use this command!`, interaction, true);

	// Check if user has dj role and command needs user to have it
	if (command.djRole && srvconfig.djrole != 'false') {
		// Get dj role, if it doesn't exist, send error message because invalid setting value
		const role = interaction.guild.roles.cache.get(srvconfig.djrole);
		if (!role) return interaction.reply({ content: interaction.lang.dj.notfound, ephemeral: true });

		// Check if user has role, if not, send error message
		if (!interaction.member.roles.cache.has(srvconfig.djrole)) return client.error(interaction.lang.rolereq.replace('${role}', role.name), interaction, true);
	}

	// Defer and execute the command
	try {
		const cmdlog = args.join ? `${command.name} ${args.join(' ')}` : command.name;
		client.logger.info(`${interaction.user.tag} issued slash command: /${cmdlog}, in ${interaction.guild.name}`.replace(' ,', ','));
		await interaction.deferReply({ ephemeral: command.ephemeral });
		interaction.reply = interaction.editReply;
		command.execute(interaction, args, client);
	}
	catch (err) {
		const interactionFailed = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('INTERACTION FAILED')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
			.addFields({ name: '**Type:**', value: 'Slash' })
			.addFields({ name: '**Interaction:**', value: command.name })
			.addFields({ name: '**Error:**', value: `\`\`\`xl\n${err}\n\`\`\`` })
			.addFields({ name: '**Guild:**', value: interaction.guild.name })
			.addFields({ name: '**Channel:**', value: interaction.channel.name });
		client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
		interaction.user.send({ embeds: [interactionFailed] }).catch(err => client.logger.warn(err));
		client.logger.error(err);
	}
};