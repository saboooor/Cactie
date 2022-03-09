const { Embed } = require('discord.js');
function clean(text) {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
const msg = require('../../lang/en/msg.json');
module.exports = async (client, interaction) => {
	if (interaction.isSelectMenu()) {
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
			const interactionFailed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
				.addFields({ name: '**Type:**', value: 'Dropdown' })
				.addFields({ name: '**Interaction:**', value: interaction.values[0] })
				.addFields({ name: '**Error:**', value: `${clean(err)}` });
			if (interaction.guild) interactionFailed.addFields({ name: '**Guild:**', value: interaction.guild.name }).addFields({ name: '**Channel:**', value: interaction.channel.name });
			client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
			interaction.user.send({ embeds: [interactionFailed] }).catch(e => { client.logger.warn(e); });
			client.logger.error(err);
		}
	}
};