const { ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const { x, o, empty } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'buttons',
	description: 'buttons (for testing)',
	args: true,
	usage: '<Rows and Columns (ex: 5x5)>',
	async execute(message, args) {
		const btns = {};
		const rows = [];
		const [ro, co] = args[0].split('x');
		if (ro > 5 || co > 5) return message.reply('The maximum size of the board is 5x5 due to Discord limitations');
		if (!isNaN(ro) || !isNaN(co) || ro == '0' || co == '0') return message.reply('Invalid Argument. Please specify the number of rows and columns (ex: 5x5)');
		for (let row = 0; row < parseInt(ro); row++) {
			rows.push(new ActionRow());
			for (let column = 0; column < parseInt(co); column++) {
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