const { ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const ticone = new ButtonComponent()
	.setCustomId('ticone')
	.setLabel('\u200b')
	.setStyle(ButtonStyle.Secondary);
const tictwo = new ButtonComponent()
	.setCustomId('tictwo')
	.setLabel('\u200b')
	.setStyle(ButtonStyle.Secondary);
const ticthree = new ButtonComponent()
	.setCustomId('ticthree')
	.setLabel('\u200b')
	.setStyle(ButtonStyle.Secondary);
const tacone = new ButtonComponent()
	.setCustomId('tacone')
	.setLabel('\u200b')
	.setStyle(ButtonStyle.Secondary);
const tactwo = new ButtonComponent()
	.setCustomId('tactwo')
	.setLabel('\u200b')
	.setStyle(ButtonStyle.Secondary);
const tacthree = new ButtonComponent()
	.setCustomId('tacthree')
	.setLabel('\u200b')
	.setStyle(ButtonStyle.Secondary);
const toeone = new ButtonComponent()
	.setCustomId('toeone')
	.setLabel('\u200b')
	.setStyle(ButtonStyle.Secondary);
const toetwo = new ButtonComponent()
	.setCustomId('toetwo')
	.setLabel('\u200b')
	.setStyle(ButtonStyle.Secondary);
const toethree = new ButtonComponent()
	.setCustomId('toethree')
	.setLabel('\u200b')
	.setStyle(ButtonStyle.Secondary);
module.exports = {
	name: 'xo',
	description: 'tic tac toe (for testing)',
	async execute(message) {
		const tic = new ActionRow().addComponents(ticone, tictwo, ticthree);
		const tac = new ActionRow().addComponents(tacone, tactwo, tacthree);
		const toe = new ActionRow().addComponents(toeone, toetwo, toethree);
		const msg = await message.reply({ content: 'balls', components: [tic, tac, toe] });

		const collector = msg.createMessageComponentCollector({ time: 36000000 });

		collector.on('collect', async i => {
			i.deferUpdate();
			console.log(i);
		});

		collector.on('end', () => msg.edit('A game of tic tac toe should not last longer than an hour are you high'));

	},
};