const { ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
module.exports = {
	name: 'xo',
	description: 'tic tac toe (for testing)',
	async execute(message) {
		const tic = new ActionRow().addComponents(
			new ButtonComponent()
				.setCustomId('ticone')
				.setLabel('\u200b')
				.setStyle(ButtonStyle.Secondary),
			new ButtonComponent()
				.setCustomId('tictwo')
				.setLabel('\u200b')
				.setStyle(ButtonStyle.Secondary),
			new ButtonComponent()
				.setCustomId('ticthree')
				.setLabel('\u200b')
				.setStyle(ButtonStyle.Secondary),
		);
		const tac = new ActionRow().addComponents(
			new ButtonComponent()
				.setCustomId('tacone')
				.setLabel('\u200b')
				.setStyle(ButtonStyle.Secondary),
			new ButtonComponent()
				.setCustomId('tactwo')
				.setLabel('\u200b')
				.setStyle(ButtonStyle.Secondary),
			new ButtonComponent()
				.setCustomId('tacthree')
				.setLabel('\u200b')
				.setStyle(ButtonStyle.Secondary),
		);
		const toe = new ActionRow().addComponents(
			new ButtonComponent()
				.setCustomId('toeone')
				.setLabel('\u200b')
				.setStyle(ButtonStyle.Secondary),
			new ButtonComponent()
				.setCustomId('toetwo')
				.setLabel('\u200b')
				.setStyle(ButtonStyle.Secondary),
			new ButtonComponent()
				.setCustomId('toethree')
				.setLabel('\u200b')
				.setStyle(ButtonStyle.Secondary),
		);
		message.reply({ content: 'balls', components: [tic, tac, toe] });
	},
};