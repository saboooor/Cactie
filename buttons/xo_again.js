const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { x, o, empty, refresh } = require('../lang/int/emoji.json');
const msg = require('../lang/en/msg.json');
const evalXO = require('../functions/evalXO.js');
const again = new ActionRowBuilder()
	.addComponents(new ButtonBuilder()
		.setCustomId('xo_again')
		.setEmoji({ id: refresh })
		.setLabel('Play Again')
		.setStyle(ButtonStyle.Secondary),
	);
module.exports = {
	name: 'xo_again',
	ephemeral: true,
	async execute(interaction, client) {
		const TicTacToe = new EmbedBuilder(interaction.message.embeds[0].toJSON());
		const lines = TicTacToe.toJSON().description.split('\n');
		const xuserId = lines[0].split('**X:** ')[1].replace(/\D/g, '');
		const ouserId = lines[1].split('**O:** ')[1].replace(/\D/g, '');
		if (xuserId != interaction.user.id && ouserId != interaction.user.id) return interaction.user.send({ content: 'You\'re not in this game!\nCreate a new one with the /tictactoe command' });
		const xuser = interaction.guild.members.cache.get(xuserId);
		const ouser = interaction.guild.members.cache.get(ouserId);
		if (!xuser || !ouser) return interaction.user.send({ content: msg.invalidmember });
		ouser.send(`${xuser} wants to play again!\n${interaction.message.url}`);
		let turn = Math.round(Math.random());
		const btns = {};
		const rows = [];
		for (let row = 1; row <= 3; row++) {
			rows.push(new ActionRowBuilder());
			for (let column = 1; column <= 3; column++) {
				btns[`${column}${row}`] = new ButtonBuilder()
					.setCustomId(`${column}${row}`)
					.setEmoji({ id: empty })
					.setStyle(ButtonStyle.Secondary);
				rows[row - 1].addComponents(btns[`${column}${row}`]);
			}
		}
		TicTacToe.setColor(turn ? 0xff0000 : 0x0000ff)
			.setFields({ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? xuser : ouser}` })
			.setThumbnail(turn ? xuser.user.avatarURL() : ouser.user.avatarURL());

		const xomsg = await interaction.message.edit({ content: `${turn ? xuser : ouser}`, embeds: [TicTacToe], components: rows });

		const collector = xomsg.createMessageComponentCollector({ time: 3600000 });
		collector.on('collect', async btninteraction => {
			if (btninteraction.customId == 'xo_again') return;
			if (btninteraction.user.id != (turn ? xuser.id : ouser.id)) return btninteraction.reply({ content: 'It\'s not your turn!', ephemeral: true });
			btninteraction.deferUpdate().catch(err => client.logger.error(err));
			const btn = btns[btninteraction.customId];
			if (btn.toJSON().style == ButtonStyle.Secondary) {
				btn.setStyle(turn ? ButtonStyle.Danger : ButtonStyle.Primary)
					.setEmoji({ id: turn ? x : o })
					.setDisabled(true);
			}
			turn = !turn;
			TicTacToe.setColor(turn ? 0xff0000 : 0x0000ff)
				.setFields({ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? xuser : ouser}` })
				.setThumbnail(turn ? xuser.user.avatarURL() : ouser.user.avatarURL());
			// 2 = empty / 4 = X / 1 = O
			const reslist = Object.keys(btns).map(i => { return `${btns[i].toJSON().style}`; });

			// Evaluate the board
			const win = evalXO(reslist);
			if (win.rows) win.rows.forEach(i => btns[i].setStyle(ButtonStyle.Success));
			if (win.winner) {
				const xwin = win.winner == 'x';
				Object.keys(btns).map(i => { btns[i].setDisabled(true); });
				TicTacToe.setColor(xwin ? 0xff0000 : 0x0000ff)
					.setFields({ name: 'Result:', value: `${xwin ? xuser : ouser} wins!` })
					.setThumbnail(xwin ? xuser.user.avatarURL() : ouser.user.avatarURL());
				rows.push(again);
				xomsg.edit({ content: `${xwin ? xuser : ouser}`, embeds: [TicTacToe], components: rows, allowedMentions: { repliedUser: xwin } });
				return collector.stop();
			}

			// check for draw
			let draw = true;
			Object.keys(btns).map(i => { if (!btns[i].toJSON().disabled) draw = false; });
			if (draw) {
				TicTacToe.setColor(0xff00ff)
					.setFields({ name: 'Result:', value: 'Draw!' })
					.setThumbnail();
				rows.push(again);
				return xomsg.edit({ content: null, embeds: [TicTacToe], components: rows }) && collector.stop();
			}

			// Go on to next turn if no matches
			xomsg.edit({ content: `${turn ? xuser : ouser}`, embeds: [TicTacToe], components: rows, allowedMentions: { repliedUser: turn } });
			const pingmsg = await interaction.channel.send(`${turn ? xuser : ouser}`);
			pingmsg.delete();
		});

		collector.on('end', () => {
			if (TicTacToe.toJSON().fields[0].name == 'Result:') return;
			xomsg.edit({ content: 'A game of tic tac toe should not last longer than an hour are you high', components: [], embeds: [] });
		});
	},
};