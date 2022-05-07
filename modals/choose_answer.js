const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { srch } = require('../lang/int/emoji.json');
module.exports = {
	name: 'choose_answer',
	deferReply: true,
	ephemeral: true,
	async execute(interaction, client) {
		try {
			const answer = interaction.fields.getTextInputValue('answer');
			interaction.reply({ content: `**The answer you chose is:**\n\`${answer}\`` });
			const embedJSON = interaction.message.embeds[0].toJSON();
			const guesser = interaction.guild.members.cache.get(embedJSON.description.split('\n')[1].replace(/\D/g, ''));
			const row = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setCustomId('guess_answer')
						.setLabel('Ask a question about the answer')
						.setEmoji({ id: srch })
						.setStyle(ButtonStyle.Primary),
				]);
			const TwentyOneQuestions = new EmbedBuilder(embedJSON)
				.setColor(0xeed84a)
				.setDescription(`**Host:**\n${interaction.member}\n**Guesser:**\n${guesser}\nAsk a question or guess the answer by clicking the button below.`)
				.setThumbnail(guesser.user.avatarURL())
				.setFooter({ text: '21 Questions left' });
			interaction.message.edit({ content: `${guesser}`, embeds: [TwentyOneQuestions], components: [row] });
			const pingmsg = await interaction.channel.send(`${guesser}`);
			pingmsg.delete().catch(err => client.logger.error(err.stack));

			const filter = i => i.customId == 'guess_answer' && i.member.id == guesser.id;
			const collector = interaction.message.createMessageComponentCollector({ filter, time: 3600000 });

			collector.on('collect', async btnint => {
				// Create and show a modal for the user to fill out the question
				const modal = new ModalBuilder()
					.setTitle('Ask a question')
					.setCustomId('guess_answer')
					.addComponents([
						new ActionRowBuilder().addComponents([
							new TextInputBuilder()
								.setCustomId(answer)
								.setLabel('Ask a question about the answer')
								.setStyle(TextInputStyle.Short)
								.setMaxLength(512),
						]),
					]);
				btnint.showModal(modal);
			});

			collector.on('end', () => {
				if (!interaction.message.embeds[0].toJSON().description.endsWith('guessed the answer!**') && !interaction.message.embeds[0].toJSON().description.endsWith('ran out of questions!**')) interaction.message.edit({ content: 'A game of 21 Questions should not last longer than an hour are you high', components: [], embeds: [] });
			});
		}
		catch (err) { client.error(err, interaction); }
	},
};