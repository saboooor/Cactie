import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, ComponentType } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import userOption from '~/options/user';

export const rockpaperscissors: SlashCommand<'cached'> = {
  description: 'Play Rock Paper Scissors',
  cooldown: 10,
  options: userOption,
  async execute(interaction) {
    const user = interaction.options.getMember('user')?.user;
    if (!user) {
      error('Invalid member! Are they in this server?', interaction, true);
      return;
    }
    if (user.id == interaction.user.id) {
      error('You played yourself, oh wait, you can\'t.', interaction, true);
      return;
    }
    if (user.bot) {
      error('Bots aren\'t fun to play with, yet. ;)', interaction, true);
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
      .setFields([{ name: '**Waiting for:**', value: `${interaction.user}\n${user}` }]);

    const rpsmsg = await interaction.reply({ content: `${interaction.user} ${user}`, embeds: [RPSEmbed], components: [row] });

    const filter = (i: ButtonInteraction) => i.user.id == interaction.user.id || i.user.id == user.id;
    const collector = rpsmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });

    const choices: {
      [id: string]: string;
    } = {};
    collector.on('collect', async btnint => {
      if (btnint.customId != 'rock' && btnint.customId != 'paper' && btnint.customId != 'scissors') return;
      await btnint.deferReply({ ephemeral: true }).catch((err: Error) => logger.error(err));
      if (choices[btnint.user.id]) {
        btnint.editReply({ content: `You've already selected ${emoji[choices[btnint.user.id] as keyof typeof emoji][2]}!` });
        return;
      }
      choices[btnint.user.id] = btnint.customId;
      await btnint.editReply({ content: `**Selected ${emoji[btnint.customId as keyof typeof emoji][2]}!**` });

      if (btnint.user.id == interaction.user.id) RPSEmbed.setFields([{ name: '**Waiting for:**', value: `${user}` }]);
      else if (btnint.user.id == user.id) RPSEmbed.setFields([{ name: '**Waiting for:**', value: `${interaction.user}` }]);

      if (choices[interaction.user.id] && choices[user.id]) {
        RPSEmbed.setFields([]);
        let win = true;
        if (choices[user.id] == 'rock' && choices[interaction.user.id] == 'scissors') win = false;
        else if (choices[user.id] == 'paper' && choices[interaction.user.id] == 'rock') win = false;
        else if (choices[user.id] == 'scissors' && choices[interaction.user.id] == 'paper') win = false;
        if (choices[interaction.user.id] == choices[user.id]) {
          RPSEmbed.setDescription(`**It's a tie!**\nBoth users picked ${emoji[choices[user.id] as keyof typeof emoji][2]}!`);
          await btnint.editReply({ embeds: [RPSEmbed], components: [] });
          return;
        }
        const winner = win ? interaction.user : user;
        const loser = win ? user : interaction.user;
        RPSEmbed.setDescription(`**${winner} wins!**\n\n${emoji[choices[winner.id] as keyof typeof emoji][2]} wins over ${emoji[choices[loser.id] as keyof typeof emoji][2]}!`)
          .setThumbnail(winner.avatarURL());
        await btnint.editReply({ embeds: [RPSEmbed], components: [] });
      }

      // Go on to next turn if no matches
      interaction.editReply({ embeds: [RPSEmbed] });
    });

    // When the collector stops, edit the message with a timeout message if the game hasn't ended already
    collector.on('end', () => {
      if (RPSEmbed.toJSON().fields) return;
      interaction.editReply({ content: 'A game of rock paper scissors should not last longer than two hours...', components: [], embeds: [] }).catch(err => logger.warn(err));
    });
  },
};