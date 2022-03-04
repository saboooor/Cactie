const { ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const btns = {
	ticone: new ButtonComponent()
		.setCustomId('ticone')
		.setLabel('\u200b')
		.setStyle(ButtonStyle.Secondary),
	tictwo: new ButtonComponent()
		.setCustomId('tictwo')
		.setLabel('\u200b')
		.setStyle(ButtonStyle.Secondary),
	ticthree: new ButtonComponent()
		.setCustomId('ticthree')
		.setLabel('\u200b')
		.setStyle(ButtonStyle.Secondary),
	tacone: new ButtonComponent()
		.setCustomId('tacone')
		.setLabel('\u200b')
		.setStyle(ButtonStyle.Secondary),
	tactwo: new ButtonComponent()
		.setCustomId('tactwo')
		.setLabel('\u200b')
		.setStyle(ButtonStyle.Secondary),
	tacthree: new ButtonComponent()
		.setCustomId('tacthree')
		.setLabel('\u200b')
		.setStyle(ButtonStyle.Secondary),
	toeone: new ButtonComponent()
		.setCustomId('toeone')
		.setLabel('\u200b')
		.setStyle(ButtonStyle.Secondary),
	toetwo: new ButtonComponent()
		.setCustomId('toetwo')
		.setLabel('\u200b')
		.setStyle(ButtonStyle.Secondary),
	toethree: new ButtonComponent()
		.setCustomId('toethree')
		.setLabel('\u200b')
		.setStyle(ButtonStyle.Secondary),
};
module.exports = {
	name: 'xo',
	description: 'tic tac toe (for testing)',
	async execute(message) {
		const tic = new ActionRow().addComponents(btns.ticone, btns.tictwo, btns.ticthree);
		const tac = new ActionRow().addComponents(btns.tacone, btns.tactwo, btns.tacthree);
		const toe = new ActionRow().addComponents(btns.toeone, btns.toetwo, btns.toethree);
		const msg = await message.reply({ content: '\u200b', components: [tic, tac, toe] });

		const collector = msg.createMessageComponentCollector({ time: 36000000 });

		collector.on('collect', async i => {
			i.deferUpdate();
			btns[i.customId].setDisabled(true);
			msg.edit({ components: [tic, tac, toe] });
		});

		collector.on('end', () => msg.edit({ content: 'A game of tic tac toe should not last longer than an hour are you high', components: [] }));

	},
};