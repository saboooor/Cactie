const { MessageEmbed, Collection, MessageButton, MessageActionRow } = require('discord.js');
function clean(text) {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
const msg = require('../lang/en/msg.json');
module.exports = async (client, interaction) => {
	// Button Handling
	if (interaction.isButton()) {
		// Get the button from the available buttons in the bot, if there isn't one, just return because discord will throw an error itself
		const button = client.buttons.get(interaction.customId);
		if (!button) return;

		// Check if bot has the permissions necessary to run the button
		if (button.botperm && (!interaction.guild.me.permissions.has(button.botperm) || !interaction.guild.me.permissionsIn(interaction.channel).has(button.botperm))) {
			client.logger.error(`Bot is missing ${button.botperm} permission from ${interaction.customId} in #${interaction.channel.name} at ${interaction.guild.name}`);
			return interaction.reply({ content: `I don't have the ${button.botperm} permission!`, ephemeral: true }).catch(e => { client.logger.warn(e); });
		}

		// Check if user has the permissions necessary to use the button
		if (button.permission && interaction.user.id !== '249638347306303499' && (!interaction.member.permissions || !interaction.member.permissions.has(button.permission) || !interaction.member.permissionsIn(interaction.channel).has(button.botperm))) {
			client.logger.error(`User is missing ${button.permission} permission from ${interaction.customId} in #${interaction.channel.name} at ${interaction.guild.name}`);
			return interaction.reply({ content: msg.permreq.replace('-p', button.permission), ephemeral: true }).catch(e => { client.logger.warn(e); });
		}

		// Create error embed
		const embed = new MessageEmbed()
			.setColor('RED');

		// Get player
		const player = client.manager.get(interaction.guild.id);

		// Check if player exists and button needs it
		if (button.player && (!player || !player.queue.current)) {
			embed.setTitle('There is no music playing.');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		// Check if bot is server muted and button needs unmute
		if (button.serverUnmute && interaction.guild.me.voice.serverMute) {
			embed.setTitle('I\'m server muted!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		// Check if user is in vc and button needs user to be in vc
		if (button.inVoiceChannel && !interaction.member.voice.channel) {
			embed.setTitle('You must be in a voice channel!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		// Check if user is in the same vc as bot and button needs it
		if (button.sameVoiceChannel && interaction.member.voice.channel !== interaction.guild.me.voice.channel) {
			embed.setTitle(`You must be in the same channel as ${client.user}!`);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		// Defer and execute the button
		try {
			client.logger.info(`${interaction.user.tag} clicked button: ${button.name}, in ${interaction.guild.name}`);
			await interaction[button.deferReply ? 'deferReply' : 'deferUpdate']({ ephemeral: button.ephemeral });
			interaction.reply = interaction.editReply;
			button.execute(interaction, client);
		}
		catch (err) {
			const interactionFailed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic : true }) })
				.addField('**Type:**', 'Button')
				.addField('**Interaction:**', button.name)
				.addField('**Error:**', clean(err));
			if (interaction.guild) interactionFailed.addField('**Guild:**', interaction.guild.name).addField('**Channel:**', interaction.channel.name);
			client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
			interaction.user.send({ embeds: [interactionFailed] }).catch(e => { client.logger.warn(e); });
			client.logger.error(err);
		}
	}
	// Dropdown Handling
	else if (interaction.isSelectMenu()) {
		// Get the dropdown from the available dropdowns in the bot, if there isn't one, just return because discord will throw an error itself
		const dropdown = client.dropdowns.get(interaction.values[0]);
		if (!dropdown) return;

		// Check if user has the permissions necessary to use the dropdown
		if (dropdown.permission && interaction.user.id !== '249638347306303499' && (!interaction.member.permissions || !interaction.member.permissions.has(dropdown.permission))) {
			client.logger.error(`User is missing ${dropdown.permission} permission from ${interaction.values[0]} in #${interaction.channel.name} at ${interaction.guild.name}`);
			return interaction.reply({ content: msg.permreq.replace('-p', dropdown.permission), ephemeral: true }).catch(e => { client.logger.warn(e); });
		}

		// Defer and execute the button
		try {
			client.logger.info(`${interaction.user.tag} clicked dropdown: ${interaction.values[0]}, in ${interaction.guild.name}`);
			await interaction.deferUpdate();
			interaction.reply = interaction.editReply;
			dropdown.execute(interaction, client);
		}
		catch (err) {
			const interactionFailed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic : true }) })
				.addField('**Type:**', 'Dropdown')
				.addField('**Interaction:**', interaction.values[0])
				.addField('**Error:**', `${clean(err)}`);
			if (interaction.guild) interactionFailed.addField('**Guild:**', interaction.guild.name).addField('**Channel:**', interaction.channel.name);
			client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
			interaction.user.send({ embeds: [interactionFailed] }).catch(e => { client.logger.warn(e); });
			client.logger.error(err);
		}
	}
	// Slash Command / Context Menu Handling
	else if (interaction.isCommand() || interaction.isContextMenu()) {
		// Get the command from the available slash cmds in the bot, if there isn't one, just return because discord will throw an error itself
		const command = client.slashcommands.get(interaction.commandName);
		if (!command) return;

		// Make args variable from interaction options for compatibility with dash command code
		// If command is context menu, set it to client instead since it's (interaction, client)
		const args = interaction.isContextMenu() ? client : interaction.options._hoistedOptions;
		if (interaction.isContextMenu()) {
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
			const messages = require('../lang/en/cooldown.json');
			const random = Math.floor(Math.random() * messages.length);

			// Get cooldown expiration timestamp
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			// If cooldown expiration hasn't passed, send cooldown message
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				const Embed = new MessageEmbed()
					.setColor(Math.round(Math.random() * 16777215))
					.setTitle(messages[random])
					.setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
				return interaction.reply({ embeds: [Embed], ephemeral: true });
			}
		}

		// Set last used timestamp to now for user and delete the timestamp after cooldown passes
		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		// Create Error Embed
		const embed = new MessageEmbed()
			.setColor('RED');

		// Check if slash command is being sent in a DM, if so, send error message because commands in DMs are stupid
		if (interaction.channel.type == 'DM') {
			embed.setTitle('You can\'t execute commands in DMs!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		// Get current settings for the guild
		const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);

		// Check if command can be ran only if the user voted since the past 24 hours
		if (command.voteOnly && client.user.id == '765287593762881616') {
			// Get vote data for user
			const vote = await client.getData('lastvoted', 'userId', interaction.member.user.id);

			// If user has not voted since the past 24 hours, send error message with vote buttons
			if (Date.now() > vote.timestamp + 86400000) {
				embed.setTitle(`You need to vote to use ${command.name}! Vote below!`)
					.setDescription('Voting helps us get Pup in more servers!\nIt\'ll only take a few seconds!');
				const row = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setURL('https://top.gg/bot/765287593762881616/vote')
							.setLabel('top.gg')
							.setStyle('LINK'),
					)
					.addComponents(
						new MessageButton()
							.setURL('https://discordbotlist.com/bots/pup/upvote')
							.setLabel('dbl.com')
							.setStyle('LINK'),
					);
				return interaction.reply({ embeds: [embed], components: [row] });
			}
		}

		// Check if user has the permissions necessary to use the command
		if (command.permission) {
			client.logger.info(JSON.stringify(interaction.member.permissions));
			client.logger.info(command.permission);
		}
		if (command.permission && (!interaction.member.permissions || (!interaction.member.permissions.has(command.permission) && !interaction.member.permissionsIn(interaction.channel).has(command.permission) && !interaction.member.roles.cache.has(srvconfig.adminrole)))) {
			if (command.permission == 'ADMINISTRATOR' && srvconfig.adminrole != 'permission') {
				client.logger.error(`User is missing ${command.permission} permission (${srvconfig.adminrole}) from /${command.name} in #${interaction.channel.name} at ${interaction.guild.name}`);
				embed.setTitle(msg.rolereq.replace('-r', interaction.guild.roles.cache.get(srvconfig.adminrole).name));
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			else {
				client.logger.error(`User is missing ${command.permission} permission from /${command.name} in #${interaction.channel.name} at ${interaction.guild.name}`);
				embed.setTitle(msg.permreq.replace('-p', command.permission));
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}

		// Check if bot has the permissions necessary to run the command
		if (command.botperm && (!interaction.guild.me.permissions || (!interaction.guild.me.permissions.has(command.botperm) && !interaction.guild.me.permissionsIn(interaction.channel).has(command.botperm)))) {
			client.logger.error(`Bot is missing ${command.botperm} permission from /${command.name} in #${interaction.channel.name} at ${interaction.guild.name}`);
			embed.setTitle(`I don't have the ${command.botperm} permission!`);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		// Get player for music checks
		const player = client.manager.get(interaction.guild.id);


		// Check if player exists and command needs it
		if (command.player && (!player || !player.queue.current)) {
			embed.setTitle('There is no music playing.');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		// Check if bot is server muted and command needs unmute
		if (command.serverUnmute && interaction.guild.me.voice.serverMute) {
			embed.setTitle('I\'m server muted!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		// Check if user is in vc and command needs user to be in vc
		if (command.inVoiceChannel && !interaction.member.voice.channel) {
			embed.setTitle('You must be in a voice channel!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		// Check if user is in the same vc as bot and command needs it
		if (command.sameVoiceChannel && interaction.member.voice.channel !== interaction.guild.me.voice.channel) {
			embed.setTitle(`You must be in the same channel as ${client.user}!`);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		// Check if user has dj role and command needs user to have it
		if (command.djRole && srvconfig.djrole != 'false') {
			// Get dj role, if it doesn't exist, send error message because invalid setting value
			const role = interaction.guild.roles.cache.get(srvconfig.djrole);
			if (!role) return interaction.reply({ content: msg.dj.notfound, ephemeral: true });

			// Check if user has role, if not, send error message
			if (!interaction.member.roles.cache.has(srvconfig.djrole)) {
				embed.setTitle(msg.rolereq.replace('-r', role.name));
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
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
			const interactionFailed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic : true }) })
				.addField('**Type:**', 'Slash')
				.addField('**Interaction:**', command.name)
				.addField('**Error:**', `${clean(err)}`)
				.addField('**Guild:**', interaction.guild.name).addField('**Channel:**', interaction.channel.name);
			client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
			interaction.user.send({ embeds: [interactionFailed] }).catch(e => { client.logger.warn(e); });
			client.logger.error(err);
		}
	}
};