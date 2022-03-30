const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
	name: 'rockpaperscissors',
	description: 'Play Rock Paper Scissors with an opponent',
	aliases: ['rps'],
	args: true,
	usage: '<Opponent User>',
	cooldown: 10,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		let member = await message.guild.members.cache.get(args[0].replace(/\D/g, ''));
		if (!member) member = await message.guild.members.fetch(args[0].replace(/\D/g, ''));
		if (!member) return client.error(message.lang.invalidmember, message, true);
		if (member.id == message.member.id) return client.error('You played yourself, oh wait, you can\'t.', message, true);
		const emoji = {
			rock: ['🪨', 'Rock', '🪨 Rock'],
			paper: ['📄', 'Paper', '📄 Paper'],
			scissors: ['✂️', 'Scissors', '✂️ Scissors'],
		};
		const row = new ActionRowBuilder();
		Object.keys(emoji).map(i => {
			row.addComponents(
				new ButtonBuilder()
					.setCustomId(i)
					.setEmoji({ name: emoji[i][0] })
					.setLabel(emoji[i][1])
					.setStyle(ButtonStyle.Secondary),
			);
		});
		const TicTacToe = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Rock Paper Scissors')
			.setDescription('Select an option!')
			.setFields({ name: '**Waiting for:**', value: `${message.member}\n${member}` });

		const rpsmsg = await message.reply({ content: `${message.member} ${member}`, embeds: [TicTacToe], components: [row] });

		const filter = i => i.user.id == message.member.id || i.user.id == member.id;
		const collector = rpsmsg.createMessageComponentCollector({ filter, time: 3600000 });

		const choices = {};
		collector.on('collect', async interaction => {
			if (interaction.customId != 'rock' && interaction.customId != 'paper' && interaction.customId != 'scissors') return;
			await interaction.deferReply({ ephemeral: true }).catch(err => client.logger.error(err));
			if (choices[interaction.user.id]) return interaction.editReply({ content: `You've already selected ${emoji[choices[interaction.user.id]][2]}!` });
			choices[interaction.user.id] = interaction.customId;
			await interaction.editReply({ content: `**Selected ${emoji[interaction.customId][2]}!**` });

			if (interaction.user.id == message.member.id) TicTacToe.setFields({ name: '**Waiting for:**', value: `${member}` });
			else if (interaction.user.id == member.id) TicTacToe.setFields({ name: '**Waiting for:**', value: `${message.member}` });

			if (choices[message.member.id] && choices[member.id]) {
				TicTacToe.setFields();
				let win = true;
				if (choices[member.id] == 'rock' && choices[message.member.id] == 'scissors') win = false;
				else if (choices[member.id] == 'paper' && choices[message.member.id] == 'rock') win = false;
				else if (choices[member.id] == 'scissors' && choices[message.member.id] == 'paper') win = false;
				if (choices[message.member.id] == choices[member.id]) {
					TicTacToe.setDescription(`**It's a tie!**\nBoth users picked ${emoji[choices[member.id]][2]}!`);
					return rpsmsg.edit({ embeds: [TicTacToe], components: [] });
				}
				const winner = win ? message.member : member;
				const loser = win ? member : message.member;
				TicTacToe.setDescription(`**${winner} wins!**\n\n${emoji[choices[winner.id]][2]} wins over ${emoji[choices[loser.id]][2]}!`)
					.setThumbnail(winner.user.avatarURL());
				return rpsmsg.edit({ embeds: [TicTacToe], components: [] });
			}

			rpsmsg.edit({ embeds: [TicTacToe] });
		});

		collector.on('end', () => {
			if (TicTacToe.toJSON().fields) return;
			rpsmsg.edit({ content: 'A game of rock paper scissors should not last longer than 15 minutes are you high', components: [], embeds: [] });
		});
	},
};