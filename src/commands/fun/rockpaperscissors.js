const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: 'rockpaperscissors',
	description: 'Play Rock Paper Scissors with an opponent',
	aliases: ['rps'],
	args: true,
	usage: '<Opponent User>',
	cooldown: 10,
	options: require('../../options/user.js'),
	async execute(message, args, client, lang) {
		let member = await message.guild.members.cache.get(args[0].replace(/\D/g, ''));
		if (!member) member = await message.guild.members.fetch(args[0].replace(/\D/g, ''));
		if (!member) return client.error(lang.invalidmember, message, true);
		if (member.id == message.member.id) return client.error('You played yourself, oh wait, you can\'t.', message, true);
		if (member.bot) return client.error('Bots aren\'t fun to play with, yet. :)');		const emoji = {
			rock: ['🪨', 'Rock', '🪨 Rock'],
			paper: ['📄', 'Paper', '📄 Paper'],
			scissors: ['✂️', 'Scissors', '✂️ Scissors'],
		};
		const row = new ActionRowBuilder();
		Object.keys(emoji).map(i => {
			row.addComponents([
				new ButtonBuilder()
					.setCustomId(i)
					.setEmoji({ name: emoji[i][0] })
					.setLabel(emoji[i][1])
					.setStyle(ButtonStyle.Secondary),
			]);
		});
		const RPSEmbed = new EmbedBuilder()
			.setColor('Random')
			.setTitle('Rock Paper Scissors')
			.setDescription('Select an option!')
			.setFields([{ name: '**Waiting for:**', value: `${message.member}\n${member}` }]);

		const rpsmsg = await message.reply({ content: `${message.member} ${member}`, embeds: [RPSEmbed], components: [row] });

		const filter = i => i.user.id == message.member.id || i.user.id == member.id;
		const collector = rpsmsg.createMessageComponentCollector({ filter, time: 3600000 });

		const choices = {};
		collector.on('collect', async interaction => {
			if (interaction.customId != 'rock' && interaction.customId != 'paper' && interaction.customId != 'scissors') return;
			await interaction.deferReply({ ephemeral: true }).catch(err => logger.error(err));
			if (choices[interaction.user.id]) return interaction.editReply({ content: `You've already selected ${emoji[choices[interaction.user.id]][2]}!` });
			choices[interaction.user.id] = interaction.customId;
			await interaction.editReply({ content: `**Selected ${emoji[interaction.customId][2]}!**` });

			if (interaction.user.id == message.member.id) RPSEmbed.setFields([{ name: '**Waiting for:**', value: `${member}` }]);
			else if (interaction.user.id == member.id) RPSEmbed.setFields([{ name: '**Waiting for:**', value: `${message.member}` }]);

			if (choices[message.member.id] && choices[member.id]) {
				RPSEmbed.setFields([]);
				let win = true;
				if (choices[member.id] == 'rock' && choices[message.member.id] == 'scissors') win = false;
				else if (choices[member.id] == 'paper' && choices[message.member.id] == 'rock') win = false;
				else if (choices[member.id] == 'scissors' && choices[message.member.id] == 'paper') win = false;
				if (choices[message.member.id] == choices[member.id]) {
					RPSEmbed.setDescription(`**It's a tie!**\nBoth users picked ${emoji[choices[member.id]][2]}!`);
					return await interaction.editReply({ embeds: [RPSEmbed], components: [] });
				}
				const winner = win ? message.member : member;
				const loser = win ? member : message.member;
				RPSEmbed.setDescription(`**${winner} wins!**\n\n${emoji[choices[winner.id]][2]} wins over ${emoji[choices[loser.id]][2]}!`)
					.setThumbnail(winner.user.avatarURL());
				return await interaction.editReply({ embeds: [RPSEmbed], components: [] });
			}

			// Go on to next turn if no matches
			if (message.commandName) message.editReply({ embeds: [RPSEmbed] });
			else rpsmsg.edit({ embeds: [RPSEmbed] });
		});

		// When the collector stops, edit the message with a timeout message if the game hasn't ended already
		collector.on('end', () => {
			if (RPSEmbed.toJSON().fields) return;
			if (message.commandName) message.editReply({ content: 'A game of rock paper scissors should not last longer than two hours...', components: [], embeds: [] }).catch(err => logger.warn(err));
			else rpsmsg.edit({ content: 'A game of rock paper scissors should not last longer than two hours...', components: [], embeds: [] }).catch(err => logger.warn(err));
		});
	},
};