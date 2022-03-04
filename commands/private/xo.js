const { ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const { x, o, empty } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'xo',
	description: 'tic tac toe (for testing)',
	async execute(message) {
		const btns = {
			ticone: new ButtonComponent()
				.setCustomId('ticone')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			tictwo: new ButtonComponent()
				.setCustomId('tictwo')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			ticthree: new ButtonComponent()
				.setCustomId('ticthree')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			tacone: new ButtonComponent()
				.setCustomId('tacone')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			tactwo: new ButtonComponent()
				.setCustomId('tactwo')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			tacthree: new ButtonComponent()
				.setCustomId('tacthree')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			toeone: new ButtonComponent()
				.setCustomId('toeone')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			toetwo: new ButtonComponent()
				.setCustomId('toetwo')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			toethree: new ButtonComponent()
				.setCustomId('toethree')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
		};
		const tic = new ActionRow().addComponents(btns.ticone, btns.tictwo, btns.ticthree);
		const tac = new ActionRow().addComponents(btns.tacone, btns.tactwo, btns.tacthree);
		const toe = new ActionRow().addComponents(btns.toeone, btns.toetwo, btns.toethree);
		const msg = await message.reply({ content: '\u200b', components: [tic, tac, toe] });

		const collector = msg.createMessageComponentCollector({ time: 36000000 });

		collector.on('collect', async i => {
			i.deferUpdate();
			const btn = btns[i.customId];
			if (btn.style == ButtonStyle.Secondary) {
				btn.setStyle(ButtonStyle.Danger)
					.setEmoji({ id: x });
			}
			msg.edit({ components: [tic, tac, toe] });
		});

		collector.on('end', () => msg.edit({ content: 'A game of tic tac toe should not last longer than an hour are you high', components: [] }));

	},
};