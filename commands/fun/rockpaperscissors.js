const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { refresh } = require('../../lang/int/emoji.json');
const msg = require('../../lang/en/msg.json');
const again = new ActionRowBuilder()
	.addComponents(new ButtonBuilder()
		.setCustomId('xo_again')
		.setEmoji({ id: refresh })
		.setLabel('Play Again')
		.setStyle(ButtonStyle.Secondary),
	);
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
			.setDescription(`Select an option!\n**Waiting for:**\n${message.member}\n${user}`);

		const rpsmsg = await message.reply({ content: `${message.member}\n${user}`, embeds: [TicTacToe], components: [row] });

		const collector = rpsmsg.createMessageComponentCollector({ time: 3600000 });

		collector.on('collect', async interaction => {
			if (interaction.customId != 'rock' && interaction.customId != 'paper' && interaction.customId != 'scissors') return;
			interaction.deferReply({ ephemeral: true }).catch(err => client.logger.error(err));
			if (interaction.user.id != message.member.id && interaction.user.id != user.id) return interaction.editReply({ content: 'you\'re not in this game!' });
			interaction.editReply({ content: `Selected ${interaction.emoji.name} ${interaction.customId}!` });
		});

		collector.on('end', () => {
			if (TicTacToe.toJSON().fields[0].name == 'Result:') return;
			rpsmsg.edit({ content: 'A game of rock paper scissors should not last longer than 15 minutes are you high', components: [], embeds: [] });
		});
	},
};