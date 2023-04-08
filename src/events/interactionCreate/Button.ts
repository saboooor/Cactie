import { ButtonInteraction, Client, EmbedBuilder, StringSelectMenuInteraction, TextChannel } from 'discord.js';
import checkPerms from '../../functions/checkPerms';
import buttons from '../../lists/buttons';

export default async (client: Client, interaction: ButtonInteraction | StringSelectMenuInteraction) => {
	// Check if interaction is button
	if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
	if (!interaction.guild) return;

	const id = interaction instanceof StringSelectMenuInteraction ? interaction.values[0] : interaction.customId;

	// Log every button interaction
	logger.info(`${interaction.user.tag} clicked button with id: ${id}, in ${interaction.guild.name}`);

	// Get the button from the available buttons in the bot, if there isn't one, just return because discord will throw an error itself
	const button = buttons.get(id);
	if (!button) return;

	// Check if bot has the permissions necessary in the guild to run the command
	if (button.botPerms) {
		const permCheck = checkPerms(button.botPerms, interaction.guild.members.me!);
		if (permCheck) return error(permCheck, interaction, true);
	}

	// Log
	logger.info(`${interaction.user.tag} clicked long-term button: ${button.name}, in ${interaction.guild.name}`);

	// Defer and execute the button
	try {
		if (!button.noDefer) {
			await interaction[button.deferReply ? 'deferReply' : 'deferUpdate']({ ephemeral: button.ephemeral });
			interaction.reply = interaction.editReply as typeof interaction.reply;
		}
		button.execute(interaction, client);
	}
	catch (err) {
		const interactionFailed = new EmbedBuilder()
			.setColor('Random')
			.setTitle('INTERACTION FAILED')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() ?? undefined })
			.addFields([
				{ name: '**Type:**', value: 'Button' },
				{ name: '**Interaction:**', value: `${button.name}` },
				{ name: '**Error:**', value: `\`\`\`\n${err}\n\`\`\`` },
			]);
		if (interaction.guild) interactionFailed.addFields([{ name: '**Guild:**', value: interaction.guild.name }, { name: '**Channel:**', value: `${interaction.channel}` }]);
		const errorchannel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('830013224753561630')! as TextChannel;
		errorchannel.send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
		interaction.user.send({ embeds: [interactionFailed] }).catch(err => logger.warn(err));
		logger.error(err);
	}
};