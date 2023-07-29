import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonInteraction, ComponentType } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import questionsOptions from '~/options/21q';

export const questions: SlashCommand<'cached'> = {
  name: '21questions',
  description: 'Play 21 Questions with an opponent',
  cooldown: 10,
  options: questionsOptions,
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    if (member?.id == interaction.user.id) {
      error('You played yourself, oh wait, you can\'t.', interaction, true);
      return;
    }
    const questionAmt = interaction.options.getNumber('amount');
    if (questionAmt && (questionAmt < 1 || questionAmt > 25)) {
      error('The amount of questions must be between 1 and 25!', interaction, true);
      return;
    }
    if (member?.user.bot) {
      error('Bots aren\'t fun to play with, yet. ;)', interaction, true);
      return;
    }
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents([
        new ButtonBuilder()
          .setCustomId('choose_answer')
          .setLabel('Choose Answer')
          .setStyle(ButtonStyle.Secondary),
      ]);
    const TwentyOneQuestions = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle(`${questionAmt ?? 21} Questions`)
      .setDescription(`**Playing with:**\n${member ?? 'Everyone'}\n**Host:**\n${interaction.user}\nPlease choose an answer by clicking the button below.`)
      .setThumbnail(interaction.user.avatarURL());

    const questionmsg = await interaction.reply({ content: `${interaction.user}`, embeds: [TwentyOneQuestions], components: [row] });

    const filter = (i: ButtonInteraction) => i.customId == 'choose_answer' && i.user.id == interaction.user.id;
    const collector = questionmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 7200000 });

    collector.on('collect', async btnint => {
      // Create and show a modal for the user to fill out the answer
      const modal = new ModalBuilder()
        .setTitle('Choose an answer')
        .setCustomId('choose_answer')
        .addComponents([
          new ActionRowBuilder<TextInputBuilder>().addComponents([
            new TextInputBuilder()
              .setCustomId('answer')
              .setLabel('This will be the answer to the game')
              .setStyle(TextInputStyle.Short)
              .setMaxLength(1024),
          ]),
        ]);
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