const { EmbedBuilder } = require('discord.js');
module.exports = async (client, interaction) => {
	// Check if interaction is context menu
	if (!interaction.isContextMenuCommand()) return;

	// Get the command from the available slash cmds in the bot, if there isn't one, just return because discord will throw an error itself
	const command = client.contextcmds.get(interaction.commandName);
	if (!command) return;

	// Get current settings for the guild
	const srvconfig = interaction.channel.isDM() ? { language: 'English' } : await client.getData('settings', 'guildId', interaction.guild.id);

	// Get the language for the user if specified or guild language
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${interaction.user.id}'`);
	let lang = require(`../../../lang/${srvconfig.language}/msg.json`);
	if (data[0]) lang = require(`../../../lang/${data[0].language}/msg.json`);
	else if (interaction.locale.split('-')[0] == 'en') lang = require('../../../lang/English/msg.json');
	else if (interaction.locale.split('-')[0] == 'pt') lang = require('../../../lang/Portuguese/msg.json');

	// Set message variable to the message of the context menu
	const msgs = await interaction.channel.messages.fetch({ around: interaction.targetId, limit: 1 });
	interaction.message = msgs.first();

	// Defer and execute the command
	try {
		client.logger.info(`${interaction.user.tag} issued context menu command: '${command.name}'', in ${interaction.guild.name}`.replace(' ,', ','));
		command.execute(interaction, client, lang);
	}
	catch (err) {
		const interactionFailed = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('INTERACTION FAILED')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
			.addFields([
				{ name: '**Type:**', value: 'Context Menu' },
				{ name: '**Interaction:**', value: command.name },
				{ name: '**Error:**', value: `\`\`\`\n${err}\n\`\`\`` },
			]);
		client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
		interaction.user.send({ embeds: [interactionFailed] }).catch(err => client.logger.warn(err));
		client.logger.error(err.stack);
	}
};