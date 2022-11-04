const { EmbedBuilder } = require('discord.js');
const checkPerms = require('../../functions/checkPerms');

module.exports = async (client, interaction) => {
	// Check if interaction is button
	if (!interaction.isButton() && !interaction.isSelectMenu()) return;

	// Log every button interaction
	logger.info(`${interaction.user.tag} clicked button with id: ${interaction.customId ?? interaction.value}, in ${interaction.guild.name}`);

	// Get the button from the available buttons in the bot, if there isn't one, just return because discord will throw an error itself
	const button = client.buttons.get(interaction.customId ?? interaction.value);
	if (!button) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', { guildId: interaction.guild.id });

	// Get the language for the user if specified or guild language
	let lang = require('../../lang/English/msg.json');
	if (interaction.guild.preferredLocale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (interaction.guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../lang/${srvconfig.language}/msg.json`);
	if (interaction.locale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (interaction.locale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');


	// Check if bot has the permissions necessary in the guild to run the command
	if (button.botPerms) {
		const permCheck = checkPerms(button.botPerms, interaction.guild.members.me);
		if (permCheck) return client.error(permCheck, interaction, true);
	}

	// Log
	logger.info(`${interaction.user.tag} clicked long-term button: ${button.name}, in ${interaction.guild.name}`);

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
		logger.error(err);
	}
};