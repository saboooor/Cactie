const { EmbedBuilder, InteractionType } = require('discord.js');
module.exports = async (client, interaction) => {
	// Check if interaction is modal
	if (!interaction.type == InteractionType.ModalSubmit) return;

	// Get the modal from the available modals in the bot, if there isn't one, just return because discord will throw an error itself
	const customIdSplit = interaction.customId.split('_');
	const modalInfo = customIdSplit.pop();
	const modalName = customIdSplit.join('_');
	let modal = client.modals.get(interaction.customId);
	if (!modal) modal = client.modals.get(modalName);
	if (!modal) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);

	// Get the language for the user if specified or guild language
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${interaction.user.id}'`);
	let lang = require('../../../lang/English/msg.json');
	if (interaction.guild.preferredLocale.split('-')[0] == 'en') lang = require('../../../lang/English/msg.json');
	else if (interaction.guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../../lang/${srvconfig.language}/msg.json`);
	if (interaction.locale.split('-')[0] == 'en') lang = require('../../../lang/English/msg.json');
	else if (interaction.locale.split('-')[0] == 'pt') lang = require('../../../lang/Portuguese/msg.json');
	if (data[0]) lang = require(`../../../lang/${data[0].language}/msg.json`);

	// Defer and execute the modal
	try {
		client.logger.info(`${interaction.user.tag} submitted modal: ${modal.name}, in ${interaction.guild.name}`);
		await interaction[modal.deferReply ? 'deferReply' : 'deferUpdate']({ ephemeral: modal.ephemeral });
		interaction.reply = interaction.editReply;
		modal.execute(interaction, client, lang, modalInfo);
	}
	catch (err) {
		const interactionFailed = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('INTERACTION FAILED')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
			.addFields([
				{ name: '**Type:**', value: 'Modal' },
				{ name: '**Interaction:**', value: modal.name },
				{ name: '**Error:**', value: `\`\`\`\n${err}\n\`\`\`` },
			]);
		if (interaction.guild) interactionFailed.addFields([{ name: '**Guild:**', value: interaction.guild.name }, { name: '**Channel:**', value: interaction.channel.name }]);
		client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
		interaction.user.send({ embeds: [interactionFailed] }).catch(err => client.logger.warn(err));
		client.logger.error(err.stack);
	}
};