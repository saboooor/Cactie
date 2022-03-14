const { EmbedBuilder, PermissionsBitField } = require('discord.js');
module.exports = async (client, interaction) => {
	// Check if interaction is button
	if (!interaction.isButton()) return;

	// Get the button from the available buttons in the bot, if there isn't one, just return because discord will throw an error itself
	const button = client.buttons.get(interaction.customId);
	if (!button) return;

	// Check if bot has the permissions necessary to run the button
	if (button.botperm && (!interaction.guild.me.permissions.has(PermissionsBitField.Flags[button.botperm]) || !interaction.guild.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags[button.botperm]))) {
		client.logger.error(`Bot is missing ${button.botperm} permission from ${interaction.customId} in #${interaction.channel.name} at ${interaction.guild.name}`);
		return interaction.reply({ content: `I don't have the ${button.botperm} permission!`, ephemeral: true }).catch(err => client.logger.warn(err));
	}

	// Get player
	const player = client.manager.get(interaction.guild.id);

	// Check if player exists and button needs it
	if (button.player && (!player || !player.queue.current)) return client.error('There is no music playing.', interaction, true);

	// Check if bot is server muted and button needs unmute
	if (button.serverUnmute && interaction.guild.me.voice.serverMute) return client.error('I\'m server muted!', interaction, true);

	// Check if user is in vc and button needs user to be in vc
	if (button.inVoiceChannel && !interaction.member.voice.channel) return client.error('You must be in a voice channel!', interaction, true);

	// Check if user is in the same vc as bot and button needs it
	if (button.sameVoiceChannel && interaction.member.voice.channel !== interaction.guild.me.voice.channel) return client.error(`You must be in the same channel as ${client.user}!`, interaction, true);

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