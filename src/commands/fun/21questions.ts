import { ButtonBuilder, ButtonStyle, MessageFlags, ModalBuilder, TextInputStyle, ButtonInteraction, ComponentType, ContainerBuilder } from 'discord.js';
import { Command } from '~/types/Objects';
import questionsOptions from '~/options/21q';
import { MessageCircleQuestionMark } from '~/misc/emoji';

export const questions: Command<'cached'> = {
  name: '21questions',
  description: 'Play 21 Questions',
  cooldown: 10,
  options: questionsOptions,
  async execute(interaction) {
    const user = interaction.options.getMember('user')?.user;
    if (!user) {
      error('Invalid member! Are they in this server?', interaction, true);
      return;
    }
    const questionAmt = interaction.options.getNumber('amount') ?? 21;
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
        .addTextDisplayComponents(
          (textDisplay) =>
            textDisplay.setContent(`# ${MessageCircleQuestionMark.getString()} ${questionAmt} Questions\n${interaction.user} challenged ${user} to a game of ${questionAmt} Questions!`),
        )
        .setThumbnailAccessory((thumbnail) => thumbnail.setURL(
          interaction.user.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png',
        )),
      )
      // actual game
      .addSeparatorComponents((separator) => separator)
      // this is where questions will go
      .addSectionComponents((section) => section
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent(`## Guesser: ${user}`),
        ).setThumbnailAccessory((thumbnail) => thumbnail.setURL(
          user.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png',
        )),
      )
      // this is where buttons will go
      .addActionRowComponents((actionRow) => actionRow
        .addComponents(
          new ButtonBuilder()
            .setCustomId('choose_answer')
            .setLabel('Choose Answer')
            .setStyle(ButtonStyle.Secondary),
        ),
      )
      .addSeparatorComponents((separator) => separator)
      .addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent(`${interaction.user} Please choose an answer by clicking the button above!`),
      );

    const questionmsg = await interaction.reply({ components: [QuestionsContainer], flags: [MessageFlags.IsComponentsV2] });

    const filter = (i: ButtonInteraction) => i.customId == 'choose_answer' && i.user.id == interaction.user.id;
    const collector = questionmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 7200000 });

    collector.on('collect', async btnint => {
      // Create and show a modal for the user to fill out the answer
      const modal = new ModalBuilder()
        .setTitle('Choose an answer')
        .setCustomId(`choose_answer|${interaction.user.id}|${user.id}|${questionAmt}`)
        .addLabelComponents((label) => label
          .setLabel('Please choose an answer:')
          .setTextInputComponent(textInput => textInput
            .setCustomId('answer')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(100),
          ),
        );
      btnint.showModal(modal);

      collector.stop();
    });

    // When the collector stops, edit the message with a timeout message if the game hasn't ended already
    collector.on('end', () => {
      if (collector.collected.size) return;
      interaction.editReply({ content: `A game of ${questionAmt} Questions should not last longer than two hours...`, components: [], embeds: [] }).catch(err => logger.warn(err));
    });
  },
};