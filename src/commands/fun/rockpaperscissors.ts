import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, ComponentType, User, CommandInteraction } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import user from '~/options/user';

export const rockpaperscissors: SlashCommand = {
  description: 'Play Rock Paper Scissors with an opponent',
  cooldown: 10,
  options: user,
  async execute(message, args) {
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
    const emoji = {
      rock: ['🪨', 'Rock', '🪨 Rock'],
      paper: ['📄', 'Paper', '📄 Paper'],
      scissors: ['✂️', 'Scissors', '✂️ Scissors'],
    };
    const row = new ActionRowBuilder<ButtonBuilder>();
    Object.keys(emoji).map(i => {
      row.addComponents([
        new ButtonBuilder()
          .setCustomId(i)
          .setEmoji({ name: emoji[i as keyof typeof emoji][0] })
          .setLabel(emoji[i as keyof typeof emoji][1])
          .setStyle(ButtonStyle.Secondary),
      ]);
    });
    const RPSEmbed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('Rock Paper Scissors')
      .setDescription('Select an option!')
      .setFields([{ name: '**Waiting for:**', value: `${message.member}\n${member}` }]);

    const rpsmsg = await message.reply({ content: `${message.member} ${member}`, embeds: [RPSEmbed], components: [row] });

    const filter = (i: ButtonInteraction) => i.user.id == message.member!.user.id || i.user.id == member.id;
    const collector = rpsmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });

    const choices: {
      [id: string]: string;
    } = {};
    collector.on('collect', async interaction => {
      if (interaction.customId != 'rock' && interaction.customId != 'paper' && interaction.customId != 'scissors') return;
      await interaction.deferReply({ ephemeral: true }).catch((err: Error) => logger.error(err));
      if (choices[interaction.user.id]) {
        interaction.editReply({ content: `You've already selected ${emoji[choices[interaction.user.id] as keyof typeof emoji][2]}!` });
        return;
      }
      choices[interaction.user.id] = interaction.customId;
      await interaction.editReply({ content: `**Selected ${emoji[interaction.customId as keyof typeof emoji][2]}!**` });

      if (interaction.user.id == message.member!.user.id) RPSEmbed.setFields([{ name: '**Waiting for:**', value: `${member}` }]);
      else if (interaction.user.id == member.id) RPSEmbed.setFields([{ name: '**Waiting for:**', value: `${message.member}` }]);

      if (choices[message.member!.user.id] && choices[member.id]) {
        RPSEmbed.setFields([]);
        let win = true;
        if (choices[member.id] == 'rock' && choices[message.member!.user.id] == 'scissors') win = false;
        else if (choices[member.id] == 'paper' && choices[message.member!.user.id] == 'rock') win = false;
        else if (choices[member.id] == 'scissors' && choices[message.member!.user.id] == 'paper') win = false;
        if (choices[message.member!.user.id] == choices[member.id]) {
          RPSEmbed.setDescription(`**It's a tie!**\nBoth users picked ${emoji[choices[member.id] as keyof typeof emoji][2]}!`);
          await interaction.editReply({ embeds: [RPSEmbed], components: [] });
          return;
        }
        const winner = win ? message.member : member;
        const loser = win ? member : message.member;
        RPSEmbed.setDescription(`**${winner} wins!**\n\n${emoji[choices[winner!.user.id] as keyof typeof emoji][2]} wins over ${emoji[choices[loser!.user.id] as keyof typeof emoji][2]}!`)
          .setThumbnail((winner!.user as User).avatarURL());
        await interaction.editReply({ embeds: [RPSEmbed], components: [] });
      }

      // Go on to next turn if no matches
      if (message instanceof CommandInteraction) message.editReply({ embeds: [RPSEmbed] });
      else rpsmsg.edit({ embeds: [RPSEmbed] });
    });

    // When the collector stops, edit the message with a timeout message if the game hasn't ended already
    collector.on('end', () => {
      if (RPSEmbed.toJSON().fields) return;
      if (message instanceof CommandInteraction) message.editReply({ content: 'A game of rock paper scissors should not last longer than two hours...', components: [], embeds: [] }).catch(err => logger.warn(err));
      else rpsmsg.edit({ content: 'A game of rock paper scissors should not last longer than two hours...', components: [], embeds: [] }).catch(err => logger.warn(err));
    });
  },
};