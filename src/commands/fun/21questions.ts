import { ButtonBuilder, ButtonStyle, MessageFlags, ModalBuilder, TextInputStyle, ButtonInteraction, ComponentType, ContainerBuilder } from 'discord.js';
import { Command } from '~/types/Objects';
import questionsOptions from '~/options/21q';

export const questions: Command<'cached'> = {
  name: '21questions',
  description: 'Play 21 Questions',
  cooldown: 10,
  options: questionsOptions,
  async execute(interaction) {
    const user = interaction.options.getMember('user')?.user;
    if (!user) {
      error('You must specify a user to play with!', interaction, true);
      return;
    }
    if (user?.id == interaction.user.id) {
      error('You played yourself, oh wait, you can\'t.', interaction, true);
      return;
    }
    const questionAmt = interaction.options.getNumber('amount');
    if (questionAmt && (questionAmt < 1 || questionAmt > 25)) {
      error('The amount of questions must be between 1 and 25!', interaction, true);
      return;
    }
    if (user?.bot) {
      error('Bots aren\'t fun to play with, yet. ;)', interaction, true);
      return;
    }

  // create container for the game
  const QuestionsContainer = new ContainerBuilder()
    // Title section with thumbnail
    .addSectionComponents((section) => section
      .addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent(`# ${questionAmt ?? 21} Questions`),
      )
      .addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent('-# Please choose an answer by clicking the button below!'),
      )
      .setThumbnailAccessory((thumbnail) => thumbnail.setURL(
        interaction.user.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png'
      )),
    )
    // actual game
    .addSeparatorComponents((separator) => separator)
    .addActionRowComponents((actionRow) => actionRow
      .addComponents(
        new ButtonBuilder()
          .setCustomId('choose_answer')
          .setLabel('Choose Answer')
          .setStyle(ButtonStyle.Secondary),
      ),
    )
    .addSeparatorComponents((separator) => separator)
    // legend (index 6)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**Host:** ${interaction.user}\n**Guesser:** ${user}`),
    );

    const questionmsg = await interaction.reply({ components: [QuestionsContainer], flags: [MessageFlags.IsComponentsV2] });

    const filter = (i: ButtonInteraction) => i.customId == 'choose_answer' && i.user.id == interaction.user.id;
    const collector = questionmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 7200000 });

    collector.on('collect', async btnint => {
      // Create and show a modal for the user to fill out the answer
      const modal = new ModalBuilder()
        .setTitle('Choose an answer')
        .setCustomId(`choose_answer|${interaction.user.id}|${user.id}`)
        .addLabelComponents((label) => label
          .setLabel('Please choose an answer:')
          .setTextInputComponent(textInput => textInput
            .setCustomId('answer')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(1024)
          )
        );
      btnint.showModal(modal);

      collector.stop();
    });

    // When the collector stops, edit the message with a timeout message if the game hasn't ended already
    collector.on('end', () => {
      if (collector.collected.size) return;
      interaction.editReply({ content: `A game of ${questionAmt ?? 21} Questions should not last longer than two hours...`, components: [], embeds: [] }).catch(err => logger.warn(err));
    });
  },
};