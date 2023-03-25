const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { srch } = require('../lang/int/emoji.json');

module.exports = {
	name: 'choose_answer',
	async execute(interaction, client) {
		try {
			// Get the answer from the field and send it back to the user ephemerally
			const answer = interaction.fields.getTextInputValue('answer');

			// Get the opponent from the embed description
			const embedJSON = interaction.message.embeds[0].toJSON();
			const guesser = interaction.guild.members.cache.get(embedJSON.description.split('\n')[1].replace(/\D/g, ''));

			// Create button and embed for the guesser
			const row = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setCustomId('guess_answer')
						.setLabel('Ask a question about the answer')
						.setEmoji({ id: srch })
						.setStyle(ButtonStyle.Primary),
				]);
			const TwentyOneQuestions = new EmbedBuilder(embedJSON)
				.setColor(0x5b62fa)
				.setDescription(`**Host:**\n${interaction.member}\n**Guesser:**\n${guesser}\nAsk a question or guess the answer by clicking the button below.`)
				.setThumbnail(guesser.user.avatarURL())
				.setFooter({ text: `${embedJSON.title} left` });

			// Edit the message with the new embed and button
			await interaction.editReply({ content: `${guesser}`, embeds: [TwentyOneQuestions], components: [row] });
			await interaction.followUp({ content: `**The answer you chose is:**\n\`${answer}\``, ephemeral: true });

			// Ping the user
			try {
				const pingmsg = await interaction.channel.send({ content: `${guesser}` });
				await pingmsg.delete();
			}
			catch (err) {
				logger.warn(err);
			}

			// Create a collector for the button
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

			// When the collector stops, edit the message with a timeout message if the game hasn't ended already
			collector.on('end', () => {
				if (interaction.message.embeds[0].toJSON().description.endsWith('guessed the answer!**') || interaction.message.embeds[0].toJSON().description.endsWith('ran out of questions!**')) return;
				interaction.editReply({ content: `A game of ${embedJSON.title} should not last longer than two hours...`, components: [], embeds: [] }).catch(err => logger.warn(err));
			});
		}
		catch (err) { client.error(err, interaction); }
	},
};