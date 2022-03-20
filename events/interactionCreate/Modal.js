const { EmbedBuilder } = require('discord.js');
module.exports = async (client, interaction) => {
	// Check if interaction is modal
	if (!interaction.isModalSubmit()) return;

	// Get the modal from the available modals in the bot, if there isn't one, just return because discord will throw an error itself
	const modal = client.modals.get(interaction.customId);
	if (!modal) return;

	// Get the language for the user if specified or (wip) guild language
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${interaction.user.id}'`);
	if (data[0]) interaction.lang = require(`../../lang/${data[0].language}/msg.json`);
	else interaction.lang = require('../../lang/English/msg.json');

	// Defer and execute the modal
	try {
		client.logger.info(`${interaction.user.tag} submitted modal: ${modal.name}, in ${interaction.guild.name}`);
		await interaction[modal.deferReply ? 'deferReply' : 'deferUpdate']({ ephemeral: modal.ephemeral });
		interaction.reply = interaction.editReply;
		modal.execute(interaction, client);
	}
	catch (err) {
		const interactionFailed = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('INTERACTION FAILED')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
			.addFields({ name: '**Type:**', value: 'Modal' })
			.addFields({ name: '**Interaction:**', value: modal.name })
			.addFields({ name: '**Error:**', value: `\`\`\`xl\n${err}\n\`\`\`` });
		if (interaction.guild) interactionFailed.addFields({ name: '**Guild:**', value: interaction.guild.name }).addFields({ name: '**Channel:**', value: interaction.channel.name });
		client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
		interaction.user.send({ embeds: [interactionFailed] }).catch(err => client.logger.warn(err));
		client.logger.error(err);
	}
};