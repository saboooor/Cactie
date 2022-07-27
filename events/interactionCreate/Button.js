const { EmbedBuilder, PermissionsBitField } = require('discord.js');
module.exports = async (client, interaction) => {
	// Check if interaction is button
	if (!interaction.isButton() && !interaction.isSelectMenu()) return;

	// Get the button from the available buttons in the bot, if there isn't one, just return because discord will throw an error itself
	const button = client.buttons.get(interaction.customId ?? interaction.value);
	if (!button) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);

	// Get the language for the user if specified or guild language
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${interaction.user.id}'`);
	let lang = require('../../lang/English/msg.json');
	if (interaction.guild.preferredLocale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (interaction.guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../lang/${srvconfig.language}/msg.json`);
	if (interaction.locale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (interaction.locale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');
	if (data[0]) lang = require(`../../lang/${data[0].language}/msg.json`);

	// Check if bot has the permissions necessary to run the button
	if (button.botperm
		&& (!interaction.guild.members.me.permissions
			|| (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags[button.botperm])
				&& !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags[button.botperm])
			)
		)) {
		logger.error(`Bot is missing ${button.botperm} permission from ${interaction.customId ?? interaction.value} in #${interaction.channel.name} at ${interaction.guild.name}`);
		return interaction.reply({ content: `I don't have the ${button.botperm} permission!`, ephemeral: true }).catch(err => logger.warn(err));
	}

	// Get player
	const player = client.manager.get(interaction.guild.id);

	// Log
	logger.info(`${interaction.user.tag} clicked button: ${button.name}, in ${interaction.guild.name}`);

	// Check if player exists and command needs it
	if (button.player && !player) return client.error('I\'m not in a voice channel!\nPlay some music before using this button!', interaction, true);

	// Check if player has any current song and command needs it
	if (button.playing && !player.queue.current) return client.error('I\'m not playing music!\nPlay some music before using this button!', interaction, true);

	// Check if bot is server muted and command needs unmute
	if (button.srvunmute && interaction.guild.members.me.voice.serverMute) return client.error('I\'m Server Muted!\nUnmute me before using this button!', interaction, true);

	// Check if user is in the same vc as bot and command needs it
	if (button.samevc && player && interaction.member.voice.channel.id != interaction.guild.members.me.voice.channel.id) return client.error(`You must be in the same channel as ${client.user.username} to use this button!`, interaction, true);

	// Check if user is in vc and command needs user to be in vc
	if (button.invc && !interaction.member.voice.channel) return client.error('You must be in a voice channel!\nJoin a voice channel before using this button!', interaction, true);

	// Defer and execute the button
	try {
		if (!button.noDefer) {
			await interaction[button.deferReply ? 'deferReply' : 'deferUpdate']({ ephemeral: button.ephemeral });
			interaction.reply = interaction.editReply;
		}
		button.execute(interaction, client, lang);
	}
	catch (err) {
		const interactionFailed = new EmbedBuilder()
			.setColor('Random')
			.setTitle('INTERACTION FAILED')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
			.addFields([
				{ name: '**Type:**', value: 'Button' },
				{ name: '**Interaction:**', value: button.name },
				{ name: '**Error:**', value: `\`\`\`\n${err}\n\`\`\`` },
			]);
		if (interaction.guild) interactionFailed.addFields([{ name: '**Guild:**', value: interaction.guild.name }, { name: '**Channel:**', value: interaction.channel.name }]);
		client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
		interaction.user.send({ embeds: [interactionFailed] }).catch(err => logger.warn(err));
		logger.error(err.stack);
	}
};