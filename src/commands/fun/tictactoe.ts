import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, User, ButtonInteraction, ComponentType, CommandInteraction } from 'discord.js';
import { x, o, empty, refresh } from '../../misc/emoji.json';
import evalXO from '../../functions/evalXO';
import user from '../../options/user';
import { SlashCommand } from 'types/Objects';
const again = new ActionRowBuilder<ButtonBuilder>()
  .addComponents([new ButtonBuilder()
    .setCustomId('xo_again')
    .setEmoji({ id: refresh })
    .setLabel('Play Again')
    .setStyle(ButtonStyle.Secondary),
  ]);

export const tictactoe: SlashCommand = {
  description: 'Play Tic Tac Toe with an opponent',
  aliases: ['xo'],
  args: true,
  usage: '<Opponent User>',
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
    let turn = Boolean(Math.round(Math.random()));
    const btns: any = {};
    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (let row = 1; row <= 3; row++) {
      rows.push(new ActionRowBuilder());
      for (let column = 1; column <= 3; column++) {
        btns[`${column}${row}`] = new ButtonBuilder()
          .setCustomId(`${column}${row}`)
          .setEmoji({ id: empty })
          .setStyle(ButtonStyle.Secondary);
        rows[row - 1].addComponents([btns[`${column}${row}`]]);
      }
    }
    const TicTacToe = new EmbedBuilder()
      .setColor(turn ? 0xff0000 : 0x0000ff)
      .setTitle('Tic Tac Toe')
      .setFields([{ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? message.member : member}` }])
      .setThumbnail(turn ? (message.member!.user as User).avatarURL() : member.user.avatarURL())
      .setDescription(`**X:** ${message.member}\n**O:** ${member}`);

    const xomsg = await message.reply({ content: `${turn ? message.member : member}`, embeds: [TicTacToe], components: rows });

    const filter = (i: ButtonInteraction) => i.customId != 'xo_again';
    const collector = xomsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });

    collector.on('collect', async (interaction: ButtonInteraction) => {
      if (interaction.user.id != (turn ? message.member!.user.id : member.id)) {
        interaction.reply({ content: 'It\'s not your turn!', ephemeral: true });
        return;
      }
      await interaction.deferUpdate().catch((err: Error) => logger.error(err));
      const btn = btns[interaction.customId];
      if (btn.toJSON().style == ButtonStyle.Secondary) {
        btn.setStyle(turn ? ButtonStyle.Danger : ButtonStyle.Primary)
          .setEmoji({ id: turn ? x : o })
          .setDisabled(true);
      }
      turn = !turn;
      TicTacToe.setColor(turn ? 0xff0000 : 0x0000ff)
        .setFields([{ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? message.member : member}` }])
        .setThumbnail(turn ? (message.member!.user as User).avatarURL() : member.user.avatarURL());
      // 2 = empty / 4 = X / 1 = O
      const reslist = Object.keys(btns).map(i => { return Number(`${btns[i].toJSON().style}`); });

      // Evaluate the board
      const win = evalXO(reslist);
      if (win.rows) win.rows.forEach(i => btns[i].setStyle(ButtonStyle.Success));
      if (win.winner) {
        const xwin = win.winner == 'x';
        Object.keys(btns).map(i => { btns[i].setDisabled(true); });
        TicTacToe.setColor(xwin ? 0xff0000 : 0x0000ff)
          .setFields([{ name: 'Result:', value: `${xwin ? message.member : member} wins!` }])
          .setThumbnail(xwin ? (message.member!.user as User).avatarURL() : member.user.avatarURL());
        rows.push(again);
        await interaction.editReply({ content: `${xwin ? message.member : member}`, embeds: [TicTacToe], components: rows, allowedMentions: { repliedUser: xwin } });
        return collector.stop();
      }

      // check for draw
      let draw = true;
      Object.keys(btns).map(i => { if (!btns[i].toJSON().disabled) draw = false; });
      if (draw) {
        TicTacToe.setColor(0x2f3136)
          .setFields([{ name: 'Result:', value: 'Draw!' }])
          .setThumbnail(null);
        rows.push(again);
        return await interaction.editReply({ content: null, embeds: [TicTacToe], components: rows }) && collector.stop();
      }

      // Go on to next turn if no matches
      await interaction.editReply({ content: `${turn ? message.member : member}`, embeds: [TicTacToe], components: rows, allowedMentions: { repliedUser: turn } });

      // Ping the user
      try {
        const pingmsg = await interaction.channel!.send({ content: `${turn ? message.member : member}` });
        await pingmsg.delete();
      }
      catch (err) {
        logger.warn(err);
      }
    });

    // When the collector stops, edit the message with a timeout message if the game hasn't ended already
    collector.on('end', () => {
      if (TicTacToe.toJSON().fields![0].name == 'Result:') return;
      if (message instanceof CommandInteraction) message.editReply({ content: 'A game of tic tac toe should not last longer than two hours...', components: [], embeds: [] }).catch(err => logger.warn(err));
      else xomsg.edit({ content: 'A game of tic tac toe should not last longer than two hours...', components: [], embeds: [] }).catch(err => logger.warn(err));
    });
  },
};