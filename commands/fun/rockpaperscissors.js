const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'rockpaperscissors',
	description: 'Play Rock Paper Scissors with an opponent',
	aliases: ['rps'],
	args: true,
	usage: '<Opponent User>',
	cooldown: 10,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		const user = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
		if (!user) return client.error(msg.invalidmember, message, true);
		if (user.id == message.member.id) return client.error('You played yourself, oh wait, you can\'t.', message, true);
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('rock')
				.setEmoji({ name: '🪨' })
				.setLabel('Rock')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('paper')
				.setEmoji({ name: '📄' })
				.setLabel('Paper')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('scissors')
				.setEmoji({ name: '✂' })
				.setLabel('Scissors')
				.setStyle(ButtonStyle.Secondary),
		);
		const TicTacToe = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Rock Paper Scissors')
			.setDescription('Select an option!')
			.setFields({ name: '**Waiting for:**', value: `${message.member}\n${user}` });

		const rpsmsg = await message.reply({ content: `${message.member}\n${user}`, embeds: [TicTacToe], components: [row] });

		const collector = rpsmsg.createMessageComponentCollector({ time: 3600000 });

		const choices = {};
		collector.on('collect', async interaction => {
			if (interaction.customId != 'rock' && interaction.customId != 'paper' && interaction.customId != 'scissors') return;
			await interaction.deferReply({ ephemeral: true }).catch(err => client.logger.error(err));
			if (interaction.user.id != message.member.id && interaction.user.id != user.id) return interaction.editReply({ content: 'You\'re not in this game!' });
			if (choices[interaction.user.id]) return interaction.editReply({ content: `You've already selected ${choices[interaction.user.id]}!` });
			choices[interaction.user.id] = interaction.customId;
			await interaction.editReply({ content: `Selected ${interaction.customId}!` });

			if (interaction.user.id == message.member.id) TicTacToe.setFields({ name: '**Waiting for:**', value: `${user}` });
			else if (interaction.user.id == user.id) TicTacToe.setFields({ name: '**Waiting for:**', value: `${message.member}` });

			if (choices[message.member.id] && choices[user.id]) {
				TicTacToe.setFields();
				if (choices[message.member.id] == choices[user.id]) {
					TicTacToe.setDescription(`**It's a tie!**\nBoth users picked ${choices[user.id]}!`);
				}
				else if (choices[message.member.id] == 'rock' && choices[user.id] == 'scissors') {
					TicTacToe.setDescription(`**${message.member} wins!**\n${message.member} picked rock and ${user} picked scissors!`);
				}
				else if (choices[message.member.id] == 'paper' && choices[user.id] == 'rock') {
					TicTacToe.setDescription(`**${message.member} wins!**\n${message.member} picked paper and ${user} picked rock!`);
				}
				else if (choices[message.member.id] == 'scissors' && choices[user.id] == 'paper') {
					TicTacToe.setDescription(`**${message.member} wins!**\n${message.member} picked scissors and ${user} picked paper!`);
				}
				else {
					TicTacToe.setDescription(`**${user} wins!**\n${message.member} picked ${choices[message.member.id]} and ${user} picked ${choices[user.id]}!`);
				}
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