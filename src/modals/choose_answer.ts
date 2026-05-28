import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputStyle, ButtonInteraction, ComponentType, ContainerComponent, ContainerBuilder, TextDisplayBuilder, MessageFlags } from 'discord.js';
import { MessageCircleQuestionMark } from '~/misc/emoji';
import { Modal } from '~/types/Objects';

export const choose_answer: Modal<'cached'> = {
  defer: 'update',
  execute: async (interaction, _, args) => {
    try {
      // Get the answer from the field and send it back to the user ephemerally
      const answer = interaction.fields.getTextInputValue('answer');

      // Get the opponent from the args
      const opponent = interaction.guild.members.cache.get(args?.[1] ?? '')?.user;
      if (!opponent) return;
      const questionAmt = parseInt(args?.[1] ?? '21');

      // Get current container
      const Container = interaction.message!.components[0] as ContainerComponent | undefined;
      const QuestionsContainer = new ContainerBuilder(Container?.toJSON());

      // replace current button with a button to ask a question and add the question to the embed
      QuestionsContainer.spliceComponents(3, 1, new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('guess_answer')
          .setLabel('Ask a question about the answer')
          .setEmoji({ id: MessageCircleQuestionMark.id })
          .setStyle(ButtonStyle.Primary),
      ));
      // add a text to the embed telling the guesser to ask questions and try to guess the answer
      QuestionsContainer.spliceComponents(5, 1, new TextDisplayBuilder()
        .setContent(`-# ${interaction.user} has chosen an answer! Now it's up to ${opponent} to ask questions and try to guess it!`),
      );

      // Edit the message with the new embed and button
      await interaction.editReply({ components: [QuestionsContainer] });
      await interaction.followUp({ content: `${MessageCircleQuestionMark.getString()} **The answer you chose is:**\n\`${answer}\`\n-# Do not dismiss this message or else you won't be able to see this answer again!`, flags: ['Ephemeral'] });

      // Ping the user
      try {
        const pingmsg = await interaction.channel!.send({ content: `${opponent}` });
        await pingmsg.delete();
      }
      catch (err) {
        logger.warn(err);
      }

      // Create a collector for the button
      const filter = (i: ButtonInteraction) => i.customId == 'guess_answer' && i.user.id == opponent.id;
      const collector = interaction.message!.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });
      collector.on('collect', async (btnint) => {
        // Create and show a modal for the user to fill out the question
        const modal = new ModalBuilder()
          .setTitle('Ask a question')
          .setCustomId(`guess_answer|${interaction.user.id}|${opponent?.id}|${questionAmt}`)
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