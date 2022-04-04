const { EmbedBuilder, PermissionsBitField } = require('discord.js');
module.exports = async (client, interaction) => {
	// Check if interaction is button
	if (!interaction.isButton()) return;

	// Get the button from the available buttons in the bot, if there isn't one, just return because discord will throw an error itself
	const button = client.buttons.get(interaction.customId);
	if (!button) return;

	// Get the language for the user if specified or guild language
	const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${interaction.user.id}'`);
	if (data[0]) interaction.lang = require(`../../lang/${data[0].language}/msg.json`);
	else interaction.lang = require(`../../lang/${srvconfig.language}/msg.json`);

	// Check if bot has the permissions necessary to run the button
	if (button.botperm && (!interaction.guild.me.permissions.has(PermissionsBitField.Flags[button.botperm]) || !interaction.guild.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags[button.botperm]))) {
		client.logger.error(`Bot is missing ${button.botperm} permission from ${interaction.customId} in #${interaction.channel.name} at ${interaction.guild.name}`);
		return interaction.reply({ content: `I don't have the ${button.botperm} permission!`, ephemeral: true }).catch(err => client.logger.warn(err));
	}

	// Get player
	const player = client.manager.get(interaction.guild.id);

	// Check if player exists and command needs it
	if (interaction.player && !player) return client.error('I\'m not in a voice channel!\nPlay some music before using this command!', interaction, true);

	// Check if player has any current song and command needs it
	if (interaction.playing && !player.queue.current) return client.error('I\'m not playing music!\nPlay some music before using this command!', interaction, true);

	// Check if bot is server muted and command needs unmute
	if (interaction.srvunmute && interaction.guild.me.voice.serverMute) return client.error('I\'m Server Muted!\nUnmute me before using this command!', interaction, true);

	// Check if user is in the same vc as bot and command needs it
	if (interaction.samevc && player && interaction.member.voice.channel.id != interaction.guild.me.voice.channel.id) return client.error(`You must be in the same channel as ${client.user.username} to use this command!`, interaction, true);

	// Check if user is in vc and command needs user to be in vc
	if (interaction.invc && !interaction.member.voice.channel) return client.error('You must be in a voice channel!\nJoin a voice channel before using this command!', interaction, true);

	// Defer and execute the button
	try {
		client.logger.info(`${interaction.user.tag} clicked button: ${button.name}, in ${interaction.guild.name}`);
		if (!button.noDefer) {
			await interaction[button.deferReply ? 'deferReply' : 'deferUpdate']({ ephemeral: button.ephemeral });
			interaction.reply = interaction.editReply;
		}
		button.execute(interaction, client);
	}
	catch (err) {
		const interactionFailed = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('INTERACTION FAILED')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
			.addFields({ name: '**Type:**', value: 'Button' })
			.addFields({ name: '**Interaction:**', value: button.name })
			.addFields({ name: '**Error:**', value: `\`\`\`xl\n${err}\n\`\`\`` });
		if (interaction.guild) interactionFailed.addFields({ name: '**Guild:**', value: interaction.guild.name }).addFields({ name: '**Channel:**', value: interaction.channel.name });
		client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
		interaction.user.send({ embeds: [interactionFailed] }).catch(err => client.logger.warn(err));
		client.logger.error(err);
	}
};