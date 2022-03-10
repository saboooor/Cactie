const { ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const { empty } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'buttons',
	description: 'ya just buttons idk what else',
	voteOnly: true,
	args: true,
	usage: '<Rows and Columns (ex: 5x5)>',
	cooldown: 10,
	options: require('../options/text.json'),
	async execute(message, args, client) {
		const btns = {};
		const rows = [];
		const [ro, co] = args[0].split('x');
		if (ro > 5 || co > 5) return client.error('The maximum size of the board is 5x5 due to Discord limitations', message, true);
		if (isNaN(ro) || isNaN(co) || ro == '0' || co == '0') return client.error('Invalid Argument. Please specify the number of rows and columns (ex: 5x5)', message, true);
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
		const collector = msg.createMessageComponentCollector({ time: 300000 });
		collector.on('collect', async i => {
			if (i.user != message.member.user) return i.reply({ content: 'This isn\'t your button grid!\nCreate one with the /buttons command', ephemeral: true });
			i.deferUpdate();
			const btn = btns[i.customId];
			if (btn.style == ButtonStyle.Secondary) btn.setStyle(ButtonStyle.Danger);
			else if (btn.style == ButtonStyle.Danger) btn.setStyle(ButtonStyle.Primary);
			else if (btn.style == ButtonStyle.Primary) btn.setStyle(ButtonStyle.Success);
			else if (btn.style == ButtonStyle.Success) btn.setStyle(ButtonStyle.Secondary);
			message.commandName ? message.editReply({ components: rows }) : msg.edit({ components: rows });
		});
	},
};