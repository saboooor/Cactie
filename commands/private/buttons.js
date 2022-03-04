const { ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const { x, o, empty } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'buttons',
	description: 'buttons (for testing)',
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
			ticfour: new ButtonComponent()
				.setCustomId('ticfour')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			ticfive: new ButtonComponent()
				.setCustomId('ticfive')
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
			tacfour: new ButtonComponent()
				.setCustomId('tacfour')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			tacfive: new ButtonComponent()
				.setCustomId('tacfive')
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
			toefour: new ButtonComponent()
				.setCustomId('toefour')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			toefive: new ButtonComponent()
				.setCustomId('toefive')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			fourone: new ButtonComponent()
				.setCustomId('fourone')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			fourtwo: new ButtonComponent()
				.setCustomId('fourtwo')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			fourthree: new ButtonComponent()
				.setCustomId('fourthree')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			fourfour: new ButtonComponent()
				.setCustomId('fourfour')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			fourfive: new ButtonComponent()
				.setCustomId('fourfive')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			fiveone: new ButtonComponent()
				.setCustomId('fiveone')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			fivetwo: new ButtonComponent()
				.setCustomId('fivetwo')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			fivethree: new ButtonComponent()
				.setCustomId('fivethree')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			fivefour: new ButtonComponent()
				.setCustomId('fivefour')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
			fivefive: new ButtonComponent()
				.setCustomId('fivefive')
				.setEmoji({ id: empty })
				.setStyle(ButtonStyle.Secondary),
		};
		const tic = new ActionRow().addComponents(btns.ticone, btns.tictwo, btns.ticthree, btns.ticfour, btns.ticfive);
		const tac = new ActionRow().addComponents(btns.tacone, btns.tactwo, btns.tacthree, btns.tacfour, btns.tacfive);
		const toe = new ActionRow().addComponents(btns.toeone, btns.toetwo, btns.toethree, btns.toefour, btns.toefive);
		const four = new ActionRow().addComponents(btns.fourone, btns.fourtwo, btns.fourthree, btns.fourfour, btns.fourfive);
		const five = new ActionRow().addComponents(btns.fiveone, btns.fivetwo, btns.fivethree, btns.fivefour, btns.fivefive);
		const msg = await message.reply({ content: '\u200b', components: [tic, tac, toe, four, five] });

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
			msg.edit({ components: [tic, tac, toe, four, five] });
		});

		collector.on('end', () => msg.edit({ content: 'A game of tic tac toe should not last longer than an hour are you high', components: [] }));

	},
};