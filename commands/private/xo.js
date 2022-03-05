const { Embed, ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const { x, o, empty } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'xo',
	description: 'tic tac toe (for testing)',
	args: true,
	usage: '<Opponent user>',
	cooldown: 10,
	async execute(message, args) {
		const user = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
		if (!user) return message.reply({ content: 'Invalid User!' });
		let turn = Math.round(Math.random());
		const btns = {};
		const rows = [];
		for (let row = 0; row < 3; row++) {
			rows.push(new ActionRow());
			for (let column = 0; column < 3; column++) {
				btns[`${column}${row}`] = new ButtonComponent()
					.setCustomId(`${column}${row}`)
					.setEmoji({ id: empty })
					.setStyle(ButtonStyle.Secondary);
				rows[row].addComponents(btns[`${column}${row}`]);
			}
		}
		const TicTacToe = new Embed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Tic Tac Toe')
			.setFields({ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? message.member.user : user.user}` })
			.setThumbnail(turn ? message.member.user.avatarURL() : user.user.avatarURL())
			.setDescription(`**X:** ${message.member.user}\n**O:** ${user.user}`);

		const msg = await message.reply({ content: `${turn ? message.member.user : user.user}`, embeds: [TicTacToe], components: rows });

		const collector = msg.createMessageComponentCollector({ time: 36000000 });

		collector.on('collect', async i => {
			if (i.user != (turn ? message.member.user : user.user)) return i.reply({ content: 'It\'s not your turn!', ephemeral: true });
			i.deferUpdate();
			const btn = btns[i.customId];
			if (btn.style == ButtonStyle.Secondary) {
				btn.setStyle(turn ? ButtonStyle.Danger : ButtonStyle.Primary)
					.setEmoji({ id: turn ? x : o })
					.setDisabled(true);
			}
			turn = !turn;
			TicTacToe.setColor(Math.floor(Math.random() * 16777215))
				.setFields({ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? message.member.user : user.user}` })
				.setThumbnail(turn ? message.member.user.avatarURL() : user.user.avatarURL());
			msg.edit({ content: `${turn ? message.member.user : user.user}`, embeds: [TicTacToe], components: rows, allowedMentions: { repliedUser: turn } });
		});

		collector.on('end', () => msg.edit({ content: 'A game of tic tac toe should not last longer than an hour are you high', components: [], embeds: [] }));
	},
};