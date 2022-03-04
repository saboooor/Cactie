const { ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const { x, o, empty } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'buttons',
	description: 'buttons (for testing)',
	async execute(message) {
		const btns = {};
		const rows = [];
		for (let row = 0; row < 5; row++) {
			rows.push(new ActionRow());
			for (let column = 0; column < 5; column++) {
				btns[`${column}${row}`] = new ButtonComponent()
					.setCustomId(`${column}${row}`)
					.setEmoji({ id: empty })
					.setStyle(ButtonStyle.Secondary);
				rows[row].addComponents(btns[`${column}${row}`]);
			}
		}
		const msg = await message.reply({ content: '\u200b', components: rows });

		const collector = msg.createMessageComponentCollector({ time: 36000000 });

		collector.on('collect', async i => {
			i.deferUpdate();
			const btn = btns[i.customId];
			if (btn.style == ButtonStyle.Secondary) {
				btn.setStyle(ButtonStyle.Danger)
					.setEmoji({ id: x });
			}
			else {
				btn.setStyle(ButtonStyle.Secondary)
					.setEmoji({ id: o });
			}
			msg.edit({ components: rows });
		});

		collector.on('end', () => msg.edit({ content: 'A game of tic tac toe should not last longer than an hour are you high', components: [] }));

	},
};