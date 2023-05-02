import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, User, ButtonInteraction, ComponentType, CommandInteraction } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import questionsOptions from '~/options/21q';

export const questions: SlashCommand = {
  name: '21questions',
  aliases: ['questions', '21q'],
  description: 'Play 21 Questions with an opponent',
  args: true,
  usage: '<Opponent User> [Amount of questions (default 21)]',
  cooldown: 10,
  options: questionsOptions,
  async execute(message, args) {
    if (args[1] && !isNaN(Number(args[1])) && (Number(args[1]) < 1 || Number(args[1]) > 25)) {
      error('The amount of questions must be between 1 and 25!', message, true);
      return;
    }
    const member = await message.guild!.members.fetch(args[0].replace(/\D/g, ''));
    if (!member) {
      error('Invalid member! Are they in this server?', message, true);
      return;
    }
    if (member.id == message.member!.user.id) {
      error('You played yourself, oh wait, you can\'t.', message, true);
      return;
    }
    if (member.user.bot) {
      error('Bots aren\'t fun to play with, yet. ;)', message, true);
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
      .setTitle(`${args[1] ? args[1] : 21} Questions`)
      .setDescription(`**Playing with:**\n${member}\n**Host:**\n${message.member}\nPlease choose an answer by clicking the button below.`)
      .setThumbnail((message.member!.user as User).avatarURL());

    const questionmsg = await message.reply({ content: `${message.member}`, embeds: [TwentyOneQuestions], components: [row] });

    const filter = (i: ButtonInteraction) => i.customId == 'choose_answer' && i.member!.user.id == message.member!.user.id;
    const collector = questionmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 7200000 });

    collector.on('collect', async interaction => {
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
      interaction.showModal(modal);
      collector.stop();
    });

    // When the collector stops, edit the message with a timeout message if the game hasn't ended already
    collector.on('end', () => {
      if (collector.collected.size) return;
      if (message instanceof CommandInteraction) message.editReply({ content: `A game of ${args[1] ? args[1] : 21} Questions should not last longer than two hours...`, components: [], embeds: [] }).catch(err => logger.warn(err));
      else questionmsg.edit({ content: `A game of ${args[1] ? args[1] : 21} Questions should not last longer than two hours...`, components: [], embeds: [] }).catch(err => logger.warn(err));
    });
  },
};