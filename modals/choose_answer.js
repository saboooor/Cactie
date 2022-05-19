const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { srch } = require('../lang/int/emoji.json');
module.exports = {
	name: 'choose_answer',
	deferReply: true,
	ephemeral: true,
	async execute(interaction, client) {
		try {
			// Get the answer from the field and send it back to the user ephemerally
			const answer = interaction.fields.getTextInputValue('answer');
			interaction.reply({ content: `**The answer you chose is:**\n\`${answer}\`` });

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
			await interaction.message.edit({ content: `${guesser}`, embeds: [TwentyOneQuestions], components: [row] });

			// Ping the user and delete the ping message
			const pingmsg = await interaction.channel.send(`${guesser}`);
			pingmsg.delete().catch(err => client.logger.error(err.stack));

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
				if (!interaction.message.embeds[0].toJSON().description.endsWith('guessed the answer!**') && !interaction.message.embeds[0].toJSON().description.endsWith('ran out of questions!**')) {
					interaction.message.edit({ content: `A game of ${embedJSON.title} should not last longer than an hour are you high`, components: [], embeds: [] })
						.catch(err => client.logger.warn(err));
				}
			});
		}
		catch (err) { client.error(err, interaction); }
	},
};