import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, ComponentType } from 'discord.js';
import { x, o, empty, refresh } from '~/misc/emoji.json';
import evalXO from '~/functions/evalXO';
import userOption from '~/options/user';
import { SlashCommand } from '~/types/Objects';
const again = new ActionRowBuilder<ButtonBuilder>()
  .addComponents([new ButtonBuilder()
    .setCustomId('xo_again')
    .setEmoji({ id: refresh })
    .setLabel('Play Again')
    .setStyle(ButtonStyle.Secondary),
  ]);

export const tictactoe: SlashCommand<'cached'> = {
  description: 'Play Tic Tac Toe with an opponent',
  cooldown: 10,
  options: userOption,
  async execute(interaction, args) {
    const user = (await interaction.guild.members.fetch(args[0].replace(/\D/g, ''))).user;
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
    let turn = Boolean(Math.round(Math.random()));
    const btns: {
      '11'?: ButtonBuilder;
      '12'?: ButtonBuilder;
      '13'?: ButtonBuilder;
      '21'?: ButtonBuilder;
      '22'?: ButtonBuilder;
      '23'?: ButtonBuilder;
      '31'?: ButtonBuilder;
      '32'?: ButtonBuilder;
      '33'?: ButtonBuilder;
    } = {};
    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (let row = 1; row <= 3; row++) {
      rows.push(new ActionRowBuilder<ButtonBuilder>());
      for (let column = 1; column <= 3; column++) {
        btns[`${column}${row}` as keyof typeof btns] = new ButtonBuilder()
          .setCustomId(`${column}${row}`)
          .setEmoji({ id: empty })
          .setStyle(ButtonStyle.Secondary);
        rows[row - 1].addComponents([btns[`${column}${row}` as keyof typeof btns]!]);
      }
    }
    const TicTacToe = new EmbedBuilder()
      .setColor(turn ? 0xff0000 : 0x0000ff)
      .setTitle('Tic Tac Toe')
      .setFields([{ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? interaction.user : user}` }])
      .setThumbnail(turn ? interaction.user.avatarURL() : user.avatarURL())
      .setDescription(`**X:** ${interaction.user}\n**O:** ${user}`);

    const xomsg = await interaction.reply({ content: `${turn ? interaction.user : user}`, embeds: [TicTacToe], components: rows });

    const filter = (i: ButtonInteraction) => i.customId != 'xo_again';
    const collector = xomsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });

    collector.on('collect', async (btnint: ButtonInteraction) => {
      if (btnint.user.id != (turn ? interaction.user.id : interaction.id)) {
        btnint.reply({ content: 'It\'s not your turn!', ephemeral: true });
        return;
      }
      await btnint.deferUpdate().catch((err: Error) => logger.error(err));
      const btn = btns[btnint.customId as keyof typeof btns]!;
      if (btn.toJSON().style == ButtonStyle.Secondary) {
        btn.setStyle(turn ? ButtonStyle.Danger : ButtonStyle.Primary)
          .setEmoji({ id: turn ? x : o })
          .setDisabled(true);
      }
      turn = !turn;
      TicTacToe.setColor(turn ? 0xff0000 : 0x0000ff)
        .setFields([{ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? interaction.user : user}` }])
        .setThumbnail(turn ? interaction.user.avatarURL() : user.avatarURL());
      // 2 = empty / 4 = X / 1 = O
      const reslist = Object.keys(btns).map(i => btns[i as keyof typeof btns]!.toJSON().style);

      // Evaluate the board
      const win = evalXO(reslist);
      if (win.rows) { win.rows.forEach(i => btns[i.toString() as keyof typeof btns]!.setStyle(ButtonStyle.Success)); }
      if (win.winner) {
        const xwin = win.winner == 'x';
        Object.keys(btns).map(i => { btns[i as keyof typeof btns]!.setDisabled(true); });
        TicTacToe.setColor(xwin ? 0xff0000 : 0x0000ff)
          .setFields([{ name: 'Result:', value: `${xwin ? interaction.user : user} wins!` }])
          .setThumbnail(xwin ? interaction.user.avatarURL() : user.avatarURL());
        rows.push(again);
        await btnint.editReply({ content: `${xwin ? interaction.user : user}`, embeds: [TicTacToe], components: rows, allowedMentions: { repliedUser: xwin } });
        return collector.stop();
      }

      // check for draw
      let draw = true;
      Object.keys(btns).map(i => {
        if (!btns[i as keyof typeof btns]!.toJSON().disabled) { draw = false; }
      });
      if (draw) {
        TicTacToe.setColor(0x2f3136)
          .setFields([{ name: 'Result:', value: 'Draw!' }])
          .setThumbnail(null);
        rows.push(again);
        return await btnint.editReply({ content: null, embeds: [TicTacToe], components: rows }) && collector.stop();
      }

      // Go on to next turn if no matches
      await btnint.editReply({ content: `${turn ? interaction.user : user}`, embeds: [TicTacToe], components: rows, allowedMentions: { repliedUser: turn } });

      // Ping the user
      try {
        const pingmsg = await btnint.channel!.send({ content: `${turn ? interaction.user : user}` });
        await pingmsg.delete();
      }
      catch (err) {
        logger.warn(err);
      }
    });

    // When the collector stops, edit the message with a timeout message if the game hasn't ended already
    collector.on('end', () => {
      if (TicTacToe.toJSON().fields![0].name == 'Result:') return;
      interaction.editReply({ content: 'A game of tic tac toe should not last longer than two hours...', components: [], embeds: [] }).catch(err => logger.warn(err));
    });
  },
};