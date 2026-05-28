import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, ComponentType, ContainerComponent, ContainerBuilder, TextDisplayBuilder, type LabelModalData, type TextInputModalData, MessageFlags, ModalBuilder, SectionBuilder, TextInputStyle } from 'discord.js';
import { CheckGreen, XRed, MessageCircleQuestionMark } from '~/misc/emoji';
import { Modal } from '~/types/Objects';

export const guess_answer: Modal<'cached'> = {
  defer: 'update',
  execute: async (interaction, _, args) => {
    try {
      // Since the custom id of the modal is the answer, the question field must be obtained directly from the components of the message
      const TextInputData = (interaction.components[0] as LabelModalData | undefined)?.component as TextInputModalData | undefined;
      const question = TextInputData?.value;
      const answer = TextInputData?.customId;
      if (!question || !answer) {
        error('Could not get question or answer from the modal!', interaction);
        return;
      }

      // Get the host and guesser from the args
      const host = interaction.guild.members.cache.get(args?.[0] ?? '')?.user;
      const guesser = interaction.guild.members.cache.get(args?.[1] ?? '')?.user;

      if (!host || !guesser) {
        error('Could not find host or guesser!', interaction);
        return;
      }

      // Get the current amount of questions asked from the custom id and add 1 to it
      const QuestionsLeft = parseInt(args?.[3] ?? '21') - 1;
      const currentQuestionNum = parseInt(args?.[4] ?? '1');
      const newQuestions = currentQuestionNum + 1;

      // Create the embed for the game
      const Container = interaction.message!.components[0] as ContainerComponent | undefined;
      const QuestionsContainer = new ContainerBuilder(Container?.toJSON());

      // add the question that was just asked to the embed
      const QuestionsSection = QuestionsContainer.components[2] as SectionBuilder | undefined;
      if (!QuestionsSection) {
        error('Could not find questions section in the container!', interaction);
        return;
      }
      QuestionsSection?.addTextDisplayComponents(textDisplay => textDisplay
        .setContent(`**Question ${currentQuestionNum}:**\n${question}`),
      );

      // Replace buttons with buttons to answer the question and a button to guess the answer
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setCustomId('guess|yes')
            .setLabel('Yes')
            .setEmoji({ id: CheckGreen.id })
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('guess|no')
            .setLabel('No')
            .setEmoji({ id: XRed.id })
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('guess|sometimes')
            .setLabel('Sometimes')
            .setEmoji({ id: MessageCircleQuestionMark.id })
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('guess|finish')
            .setEmoji({ name: '🎉' })
            .setLabel('You guessed it!')
            .setStyle(ButtonStyle.Primary),
        ]);
      QuestionsContainer.spliceComponents(3, 1, row);

      // add a text to the embed telling the guesser how many questions they have left
      QuestionsContainer.spliceComponents(5, 1, new TextDisplayBuilder()
        .setContent(`-# You have **${QuestionsLeft}** questions left!`),
      );

      console.log(QuestionsContainer);

      // Edit the message with the new embed and buttons
      await interaction.editReply({ components: [QuestionsContainer], flags: MessageFlags.IsComponentsV2 });

      // Ping the user
      try {
        const pingmsg = await interaction.channel!.send({ content: `${host}` });
        await pingmsg.delete();
      }
      catch (err) {
        logger.warn(err);
      }

      // Create a collector for the buttons
      const filter = (i: ButtonInteraction) => i.customId.startsWith('guess|');
      const collector = interaction.message!.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });
      collector.on('collect', async (btnint) => {
        console.log(btnint.customId);
        // Defer the button
        await btnint.deferUpdate();

        // Get the question's answer from the custom id
        const arg = btnint.customId.split('|')[1];

        // Set the fields for the answer selected
        if (arg == 'yes') {
          QuestionsSection?.addTextDisplayComponents(textDisplay => textDisplay
            .setContent(`${CheckGreen.getString()} Yes`),
          );
        }
        if (arg == 'no') {
          QuestionsSection?.addTextDisplayComponents(textDisplay => textDisplay
            .setContent(`${XRed.getString()} No`),
          );
        }
        if (arg == 'sometimes') {
          QuestionsSection?.addTextDisplayComponents(textDisplay => textDisplay
            .setContent(`${MessageCircleQuestionMark.getString()} Sometimes`),
          );
        }
        if (arg == 'finish') {
          QuestionsSection?.addTextDisplayComponents(textDisplay => textDisplay
            .setContent(`🎉 You guessed it!\n\n**The answer is**\n\`${answer}\``),
          );
          await btnint.editReply({ components: [QuestionsContainer] });
          return;
        }

        if (QuestionsLeft <= 0) {
          QuestionsContainer
            .setAccentColor(0x2f3136)
            .addSeparatorComponents((separator) => separator)
            .addTextDisplayComponents((textDisplay) =>
              textDisplay.setContent('**Game Over:** You ran out of questions!'),
            );
        }

        // replace current button with a button to ask a question and add the question to the embed
        QuestionsContainer.spliceComponents(3, 1, new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('guess_answer')
            .setLabel('Ask a question about the answer')
            .setEmoji({ id: MessageCircleQuestionMark.id })
            .setStyle(ButtonStyle.Primary),
        ));

        await btnint.editReply({ components: [QuestionsContainer] });

        // Create a collector for the button
        const filter = (i: ButtonInteraction) => i.customId == 'guess_answer' && i.user.id == guesser.id;
        const collector = interaction.message!.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });
        collector.on('collect', async (btnint) => {
          // Create and show a modal for the user to fill out the question
          const modal = new ModalBuilder()
            .setTitle('Ask a question')
            .setCustomId(`guess_answer|${host?.id}|${guesser?.id}|${QuestionsLeft}|${newQuestions}`)
            .addLabelComponents(label => label
              .setLabel('Ask a question about the answer')
              .setTextInputComponent(textInput => textInput
                .setCustomId(answer)
                .setStyle(TextInputStyle.Short),
              ),
            );
          btnint.showModal(modal);
          collector.stop();
        });

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
        QuestionsContainer
          .setAccentColor(0x2f3136)
          .addSeparatorComponents((separator) => separator)
          .addTextDisplayComponents((textDisplay) =>
            textDisplay.setContent('**Game Over:** Time ran out!'),
          );
        interaction.editReply({ components: [QuestionsContainer], flags: MessageFlags.IsComponentsV2 });
      });
    }
    catch (err) { error(err, interaction); }
  },
};