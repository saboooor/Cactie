const { EmbedBuilder } = require('discord.js');
const checkPerms = require('../../functions/checkPerms');

module.exports = async (client, interaction) => {
	// Check if interaction is context menu
	if (!interaction.isContextMenuCommand()) return;

	// Get the command from the available slash cmds in the bot, if there isn't one, just return because discord will throw an error itself
	const command = client.slashcommands.get(interaction.commandName);
	if (!command) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', { guildId: interaction.guild.id });

	// Get the language for the user if specified or guild language
	let lang = require('../../lang/English/msg.json');
	if (interaction.guild.preferredLocale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (interaction.guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../lang/${srvconfig.language}/msg.json`);
	if (interaction.locale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (interaction.locale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');

	// Check if user has the permissions necessary in the guild to use the command
	if (command.permissions) {
		const permCheck = checkPerms(command.permissions, interaction.member);
		if (permCheck) return client.error(permCheck, interaction, true);
	}

	// Check if bot has the permissions necessary in the guild to run the command
	if (command.botPerms) {
		const permCheck = checkPerms(command.botPerms, interaction.guild.members.me);
		if (permCheck) return client.error(permCheck, interaction, true);
	}

	// Set item to the command type
	let item;
	if (command.type == 'Message') item = await interaction.channel.messages.fetch(interaction.targetId);
	if (command.type == 'User') item = await interaction.guild.members.fetch(interaction.targetId);

	// Defer and execute the command
	try {
		if (!command.noDefer) {
			await interaction.deferReply({ ephemeral: command.ephemeral });
			interaction.reply = interaction.editReply;
		}
		logger.info(`${interaction.user.tag} issued context menu command: '${command.name}' with target: ${item.id}, in ${interaction.guild.name}`.replace(' ,', ','));
		command.execute(interaction, client, item, lang);
	}
	catch (err) {
		const interactionFailed = new EmbedBuilder()
			.setColor('Random')
			.setTitle('INTERACTION FAILED')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
			.addFields([
				{ name: '**Type:**', value: 'Context Menu' },
				{ name: '**Interaction:**', value: command.name },
				{ name: '**Error:**', value: `\`\`\`\n${err}\n\`\`\`` },
			]);
		client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
		interaction.user.send({ embeds: [interactionFailed] }).catch(err => logger.warn(err));
		logger.error(err);
	}
};