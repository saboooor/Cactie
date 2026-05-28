import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonInteraction, ComponentType, ContainerComponent } from 'discord.js';
import { Search } from '~/misc/emoji';
import { Modal } from '~/types/Objects';

export const choose_answer: Modal<'cached'> = {
  defer: 'update',
  execute: async (interaction, _, args) => {
    try {
      // Get the answer from the field and send it back to the user ephemerally
      const answer = interaction.fields.getTextInputValue('answer');

      // Get the opponent from the args
      const opponent = interaction.guild.members.cache.get(args?.[1] ?? '');
      if (!opponent) return;

      // Create button and embed for the guesser
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setCustomId('guess_answer')
            .setLabel('Ask a question about the answer')
            .setEmoji({ id: Search.id })
            .setStyle(ButtonStyle.Primary),
        ]);

      
      const QuestionsContainer = interaction.message!.components[0] as ContainerComponent;

      // Edit the message with the new embed and button
      await interaction.editReply({ components: [QuestionsContainer] });
      await interaction.followUp({ content: `**The answer you chose is:**\n\`${answer}\``, flags: ['Ephemeral'] });

      // Ping the user
      try {
        const pingmsg = await interaction.channel!.send({ content: `${opponent}` });
        await pingmsg.delete();
      }
      catch (err) {
        logger.warn(err);
      }

      // Create a collector for the button
      const filter = (i: ButtonInteraction) => i.customId == 'guess_answer' && (opponent ? i.user.id == opponent.id : true);
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
      collector.on('egnd', () => {
        if (!interaction.message!.embeds[0].toJSON().description!.endsWith('guessed the answer!**') || interaction.message!.embeds[0].toJSON().description!.endsWith('ran out of questions!**')) { return; }
        interaction.editReply({ content: `A game of should not last longer than two hours...`, components: [], embeds: [] }).catch(err => logger.warn(err));
      });
    }
    catch (err) { error(err, interaction); }
  },
};