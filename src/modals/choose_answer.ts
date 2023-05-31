import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonInteraction, ComponentType } from 'discord.js';
import { srch } from '~/misc/emoji.json';
import { Modal } from '~/types/Objects';

export const choose_answer: Modal = {
  execute: async (interaction) => {
    try {
      // Get the answer from the field and send it back to the user ephemerally
      const answer = interaction.fields.getTextInputValue('answer');

      // Get the opponent from the embed description
      const embedJSON = interaction.message!.embeds[0].toJSON();
      const guesser = interaction.guild!.members.cache.get(embedJSON.description!.split('\n')[1].replace(/\D/g, ''));

      // Create button and embed for the guesser
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setCustomId('guess_answer')
            .setLabel('Ask a question about the answer')
            .setEmoji({ id: srch })
            .setStyle(ButtonStyle.Primary),
        ]);
      const TwentyOneQuestions = new EmbedBuilder(embedJSON)
        .setColor(0x5b62fa)
        .setDescription(`**Host:**\n${interaction.member}\n**Guesser:**\n${guesser ?? 'Anyone'}\nAsk a question or guess the answer by clicking the button below.`)
        .setFooter({ text: `${embedJSON.title} left` });

      if (guesser) TwentyOneQuestions.setThumbnail(guesser.user.avatarURL());

      // Edit the message with the new embed and button
      await interaction.editReply({ content: `${guesser}`, embeds: [TwentyOneQuestions], components: [row] });
      await interaction.followUp({ content: `**The answer you chose is:**\n\`${answer}\``, ephemeral: true });

      // Ping the user
      try {
        const pingmsg = await interaction.channel!.send({ content: `${guesser}` });
        await pingmsg.delete();
      }
      catch (err) {
        logger.warn(err);
      }

      // Create a collector for the button
      const filter = (i: ButtonInteraction) => i.customId == 'guess_answer' && (guesser ? i.member!.user.id == guesser.id : true);
      const collector = interaction.message!.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });
      collector.on('collect', async (btnint) => {
        // Create and show a modal for the user to fill out the question
        const modal = new ModalBuilder()
          .setTitle('Ask a question')
          .setCustomId('guess_answer')
          .addComponents([
            new ActionRowBuilder<TextInputBuilder>()
              .addComponents([
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
        if (interaction.message!.embeds[0].toJSON().description!.endsWith('guessed the answer!**') || interaction.message!.embeds[0].toJSON().description!.endsWith('ran out of questions!**')) { return; }
        interaction.editReply({ content: `A game of ${embedJSON.title} should not last longer than two hours...`, components: [], embeds: [] }).catch(err => logger.warn(err));
      });
    }
    catch (err) { error(err, interaction); }
  },
};