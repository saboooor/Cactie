const { Embed, ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const { x, o, empty, refresh } = require('../lang/int/emoji.json');
function EndXO(btns, a, b, c, TicTacToe, msg, xuser, ouser, rows) {
	btns[a].setStyle(ButtonStyle.Success);
	btns[b].setStyle(ButtonStyle.Success);
	btns[c].setStyle(ButtonStyle.Success);
	Object.keys(btns).map(i => { return `${btns[i].setDisabled(true)}`; });
	const xwin = btns[a].data.emoji.id == x;
	TicTacToe.setColor(xwin ? 0xff0000 : 0x0000ff)
		.setFields({ name: 'Result:', value: `${xwin ? xuser : ouser} wins!` })
		.setThumbnail(xwin ? xuser.avatarURL() : ouser.avatarURL());
	rows.push(again);
	msg.edit({ content: `${xwin ? xuser : ouser}`, embeds: [TicTacToe], components: rows, allowedMentions: { repliedUser: xwin } });
}
const again = new ActionRow()
	.addComponents(new ButtonComponent()
		.setCustomId('xo_again')
		.setEmoji({ id: refresh })
		.setLabel('Play Again')
		.setStyle(ButtonStyle.Secondary),
	);
module.exports = {
	name: 'xo_again',
	async execute(interaction) {
		const userId = interaction.message.embeds[0].description.split('**O:** ')[1].replace(/\D/g, '');
		const user = interaction.guild.members.cache.get(userId);
		if (!user) return interaction.reply({ content: 'Invalid User!' });
		if (user.user.id == interaction.member.user.id) return interaction.reply({ content: 'You played yourself, oh wait, you can\'t.' });
		let turn = Math.round(Math.random());
		const btns = {};
		const rows = [];
		for (let row = 1; row <= 3; row++) {
			rows.push(new ActionRow());
			for (let column = 1; column <= 3; column++) {
				btns[`${column}${row}`] = new ButtonComponent()
					.setCustomId(`${column}${row}`)
					.setEmoji({ id: empty })
					.setStyle(ButtonStyle.Secondary);
				rows[row - 1].addComponents(btns[`${column}${row}`]);
			}
		}
		const TicTacToe = new Embed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Tic Tac Toe')
			.setFields({ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? interaction.member.user : user.user}` })
			.setThumbnail(turn ? interaction.member.user.avatarURL() : user.user.avatarURL())
			.setDescription(`**X:** ${interaction.member.user}\n**O:** ${user.user}`);

		const msg = await interaction.message.edit({ content: `${turn ? interaction.member.user : user.user}`, embeds: [TicTacToe], components: rows });

		const collector = msg.createMessageComponentCollector({ time: 36000000 });

		collector.on('collect', async btninteraction => {
			if (btninteraction.user.id != (turn ? interaction.member.user.id : user.user.id)) return btninteraction.reply({ content: 'It\'s not your turn!', ephemeral: true });
			btninteraction.deferUpdate();
			const btn = btns[btninteraction.customId];
			if (btn.style == ButtonStyle.Secondary) {
				btn.setStyle(turn ? ButtonStyle.Danger : ButtonStyle.Primary)
					.setEmoji({ id: turn ? x : o })
					.setDisabled(true);
			}
			turn = !turn;
			TicTacToe.setColor(Math.floor(Math.random() * 16777215))
				.setFields({ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? interaction.member.user : user.user}` })
				.setThumbnail(turn ? interaction.member.user.avatarURL() : user.user.avatarURL());
			// 2 = empty / 4 = X / 1 = O
			const reslist = Object.keys(btns).map(i => { return `${btns[i].data.style}`; });

			// horizontal
			if (reslist[0] == reslist[1] && reslist[1] == reslist[2] && reslist[0] != ButtonStyle.Secondary) return EndXO(btns, 11, 12, 13, TicTacToe, msg, interaction.member.user, user.user, rows) && collector.stop();
			if (reslist[3] == reslist[4] && reslist[4] == reslist[5] && reslist[3] != ButtonStyle.Secondary) return EndXO(btns, 21, 22, 23, TicTacToe, msg, interaction.member.user, user.user, rows) && collector.stop();
			if (reslist[6] == reslist[7] && reslist[7] == reslist[8] && reslist[6] != ButtonStyle.Secondary) return EndXO(btns, 31, 32, 33, TicTacToe, msg, interaction.member.user, user.user, rows) && collector.stop();
			// diagonal
			if (reslist[0] == reslist[4] && reslist[4] == reslist[8] && reslist[0] != ButtonStyle.Secondary) return EndXO(btns, 11, 22, 33, TicTacToe, msg, interaction.member.user, user.user, rows) && collector.stop();
			if (reslist[6] == reslist[4] && reslist[4] == reslist[2] && reslist[6] != ButtonStyle.Secondary) return EndXO(btns, 13, 22, 31, TicTacToe, msg, interaction.member.user, user.user, rows) && collector.stop();
			// vertical
			if (reslist[0] == reslist[3] && reslist[3] == reslist[6] && reslist[0] != ButtonStyle.Secondary) return EndXO(btns, 11, 21, 31, TicTacToe, msg, interaction.member.user, user.user, rows) && collector.stop();
			if (reslist[1] == reslist[4] && reslist[4] == reslist[7] && reslist[1] != ButtonStyle.Secondary) return EndXO(btns, 12, 22, 32, TicTacToe, msg, interaction.member.user, user.user, rows) && collector.stop();
			if (reslist[2] == reslist[5] && reslist[5] == reslist[8] && reslist[2] != ButtonStyle.Secondary) return EndXO(btns, 13, 23, 33, TicTacToe, msg, interaction.member.user, user.user, rows) && collector.stop();

			// check for draw
			let draw = true;
			Object.keys(btns).map(i => { if (!btns[i].data.disabled) draw = false; });
			if (draw) {
				TicTacToe.setColor(0xff00ff)
					.setFields({ name: 'Result:', value: 'Draw!' })
					.setThumbnail();
				rows.push(again);
				return msg.edit({ content: null, embeds: [TicTacToe], components: rows }) && collector.stop();
			}

			// Go on to next turn if no matches
			msg.edit({ content: `${turn ? interaction.member.user : user.user}`, embeds: [TicTacToe], components: rows, allowedMentions: { repliedUser: turn } });
		});

		collector.on('end', () => {
			if (TicTacToe.fields[0].name == 'Result:') return;
			msg.edit({ content: 'A game of tic tac toe should not last longer than an hour are you high', components: [], embeds: [] });
		});
	},
};