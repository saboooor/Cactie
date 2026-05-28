import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, ComponentType, ContainerComponent, ContainerBuilder, TextDisplayBuilder, type LabelModalData, type TextInputModalData, MessageFlags, SectionBuilder, SectionComponent } from 'discord.js';
import { CheckGreen, XRed, Search } from '~/misc/emoji';
import { Modal } from '~/types/Objects';

export const guess_answer: Modal<'cached'> = {
  execute: async (interaction, _, args) => {
    try {
      // Since the custom id of the modal is the answer, the question field must be obtained directly from the components of the message
      const TextInputData = (interaction.components[0] as LabelModalData | undefined)?.component as TextInputModalData | undefined;
      const question = TextInputData?.value;
      const answer = TextInputData?.customId;

      // Get the host and guesser from the args
      const host = interaction.guild.members.cache.get(args?.[0] ?? '')?.user;
      const guesser = interaction.guild.members.cache.get(args?.[1] ?? '')?.user;

      // Get the current amount of questions asked from the custom id and add 1 to it
      const QuestionsLeft = parseInt(args?.[3] ?? '21') - 1;
      const currentQuestionNum = parseInt(args?.[4] ?? '1');
      const newQuestions = currentQuestionNum + 1;

      // Create the embed for the game
      const Container = interaction.message!.components[0] as ContainerComponent | undefined;
      const QuestionsContainer = new ContainerBuilder(Container?.toJSON());

      // add the question that was just asked to the embed
      const Section = QuestionsContainer.components[2] as SectionBuilder | undefined;
      Section?.addTextDisplayComponents(textDisplay => textDisplay
        .setContent(`**Question ${currentQuestionNum}:**\n${question}`),
      );

      // Replace buttons with buttons to answer the question and a button to guess the answer
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setCustomId('guess_yes')
            .setLabel('Yes')
            .setEmoji({ id: CheckGreen.id })
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('guess_no')
            .setLabel('No')
            .setEmoji({ id: XRed.id })
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('guess_sometimes')
            .setLabel('Sometimes')
            .setEmoji({ name: '🤷🏽' })
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('guess_finish')
            .setEmoji({ name: '🎉' })
            .setLabel('You guessed it!')
            .setStyle(ButtonStyle.Primary),
        ]);
      QuestionsContainer.spliceComponents(3, 1, row);

      // add a text to the embed telling the guesser how many questions they have left
      QuestionsContainer.spliceComponents(5, 1, new TextDisplayBuilder()
        .setContent(`-# You have **${QuestionsLeft}** questions left!`),
      );

      // Edit the message with the new embed and buttons
      await interaction.reply({ components: [QuestionsContainer], flags: MessageFlags.IsComponentsV2 });

      // Ping the user
      try {
        const pingmsg = await interaction.channel!.send({ content: `${host}` });
        await pingmsg.delete();
      }
      catch (err) {
        logger.warn(err);
      }

      // Create a collector for the buttons
      const filter = (i: ButtonInteraction) => i.customId.startsWith('guess|') && i.member!.user.id == host?.id;
      const collector = interaction.message!.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });
      collector.on('collect', async (btnint) => {
        // Defer the button
        await btnint.deferUpdate();

        // Get the answer from the custom id
        const answer = btnint.customId.split('|')[1];

        // Set the fields for the answer selected
        if (answer == 'yes') {
        }
        if (answer == 'no') {
        }
        if (answer == 'sometimes') {
        }
        if (answer == 'finish') {
					TwentyOneQuestions.toJSON().fields![TwentyOneQuestions.toJSON().fields!.length - 1].value = `🎉 You guessed it!\n\n**The answer is**\n\`${answer}\``;

					// Finish the game with a positive response
					TwentyOneQuestions.setDescription(`**Host:**\n${host}\n**${interaction.member} guessed the answer!**`);
					btnint.editReply({ content: `${interaction.member}`, embeds: [TwentyOneQuestions], components: [] });
					return;
        }
        if (TwentyOneQuestions.toJSON().footer!.text == '0 Questions left') {
					TwentyOneQuestions.toJSON().fields![TwentyOneQuestions.toJSON().fields!.length - 1].value = `${TwentyOneQuestions.toJSON().fields![TwentyOneQuestions.toJSON().fields!.length - 1].value}\n\n**You ran out of questions!\nThe answer was**\n\`${answer}\``;

					// End the game with a negative response
					TwentyOneQuestions.setDescription(`**Host:**\n${host}\n**${guesser ?? 'The opponents'} ran out of questions!**`);
					btnint.editReply({ content: `${interaction.member}`, embeds: [TwentyOneQuestions], components: [] });
					return;
        }

        // Add a button for the opponent to guess the answer
        const guessrow = new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setCustomId('guess_answer')
              .setLabel('Ask a question about the answer')
              .setEmoji({ id: Search.id })
              .setStyle(ButtonStyle.Primary),
          ]);

        // Edit the message with the updated embed and button
        TwentyOneQuestions.setDescription(`**Host:**\n${host}\n**Guesser:**\n${guesser ?? 'Anyone'}\nAsk a question or guess the answer.`);
        await btnint.editReply({ content: guesser ? `${guesser}` : null, embeds: [TwentyOneQuestions], components: [guessrow] });

        // Ping the user
        try {
          const pingmsg = await interaction.channel!.send({ content: `${guesser}` });
          await pingmsg.delete();
        }
        catch (err) {
          logger.warn(err);
        }

        // Stop the answer collector
        collector.stop();
      });

      // When the collector stops, edit the message with a timeout message if the game hasn't ended already
      collector.on('end', () => {
        if (collector.collected.size) return;
        interaction.editReply({ content: `A game of ${embedJSON.title} should not last longer than two hours...`, components: [], embeds: [] }).catch(err => logger.warn(err));
      });
    }
    catch (err) { error(err, interaction); }
  },
};