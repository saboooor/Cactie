const { ButtonComponent, ButtonStyle, ActionRow, Modal, TextInputComponent, TextInputStyle } = require('discord.js');
module.exports = {
	name: 'modal',
	description: 'shows a modal (for testing)',
	async execute(message) {
		const row = new ActionRow()
			.addComponents(
				new ButtonComponent()
					.setCustomId('show_modal')
					.setLabel('Show modal')
					.setStyle(ButtonStyle.Primary),
			);
		const msg = await message.reply({ content: 'balls', components: [row] });

		const collector = msg.createMessageComponentCollector({ time: 240000 });
		collector.on('collect', async interaction => {
			const modal = new Modal()
				.setTitle('i wanna off myself')
				.setCustomId('huh');
			const rows = [];
			rows.push(new ActionRow().addComponents(
				new TextInputComponent()
					.setCustomId('modal_long_text')
					.setLabel('Paragraph Text')
					.setStyle(TextInputStyle.Paragraph),
			));
			rows.push(new ActionRow().addComponents(
				new TextInputComponent()
					.setCustomId('modal_short_text')
					.setLabel('Short Text')
					.setStyle(TextInputStyle.Short),
			));
			modal.addComponents(...rows);
			await interaction.showModal(modal);
		});
	},
};