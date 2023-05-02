import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, ComponentType } from 'discord.js';
import { x, o, empty, refresh } from '~/misc/emoji.json';
import evalXO from '~/functions/evalXO';
import { Button } from '~/types/Objects';
const again = new ActionRowBuilder<ButtonBuilder>()
  .addComponents([new ButtonBuilder()
    .setCustomId('xo_again')
    .setEmoji({ id: refresh })
    .setLabel('Play Again')
    .setStyle(ButtonStyle.Secondary),
  ]);

export const xo_again: Button = {
  ephemeral: true,
  execute: async (interaction) => {
    const TicTacToe = new EmbedBuilder(interaction.message.embeds[0].toJSON())!;
    const lines = TicTacToe.toJSON().description!.split('\n');
    const xuserId = lines[0].split('**X:** ')[1].replace(/\D/g, '');
    const ouserId = lines[1].split('**O:** ')[1].replace(/\D/g, '');
    if (xuserId != interaction.user.id && ouserId != interaction.user.id) {
      interaction.reply({ content: 'You\'re not in this game!\nCreate a new one with the /tictactoe command' });
      return;
    }
    const xuser = interaction.guild!.members.cache.get(xuserId);
    const ouser = interaction.guild!.members.cache.get(ouserId);
    if (!xuser || !ouser) {
      interaction.reply({ content: 'Invalid member! Are they in this server?' });
      return;
    }
    const playAgainEmbed = new EmbedBuilder()
      .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL() ?? undefined })
      .setDescription(`${interaction.user} wants to play again!`)
      .setFooter({ text: 'Click the button below to respond!' });
    const againlink = new ActionRowBuilder<ButtonBuilder>()
      .addComponents([new ButtonBuilder()
        .setURL(interaction.message.url)
        .setEmoji({ id: refresh })
        .setLabel('Play Tic Tac Toe')
        .setStyle(ButtonStyle.Link),
      ]);
    const dmuser = xuserId == interaction.user.id ? ouser : xuser;
    dmuser.send({ embeds: [playAgainEmbed], components: [againlink] });
    let turn = Math.round(Math.random());
    const btns: any = {};
    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (let row = 1; row <= 3; row++) {
      rows.push(new ActionRowBuilder<ButtonBuilder>());
      for (let column = 1; column <= 3; column++) {
        btns[`${column}${row}`] = new ButtonBuilder()
          .setCustomId(`${column}${row}`)
          .setEmoji({ id: empty })
          .setStyle(ButtonStyle.Secondary);
        rows[row - 1].addComponents([btns[`${column}${row}`]]);
      }
    }
    TicTacToe.setColor(turn ? 0xff0000 : 0x0000ff)
      .setFields([{ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? xuser : ouser}` }])
      .setThumbnail(turn ? xuser.user.avatarURL() : ouser.user.avatarURL());

    const xomsg = await interaction.editReply({ content: `${turn ? xuser : ouser}`, embeds: [TicTacToe], components: rows });

    const filter = (i: ButtonInteraction) => i.customId != 'xo_again';
    const collector = xomsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });
    collector.on('collect', async (btninteraction) => {
      if (btninteraction.user.id != (turn ? xuser.id : ouser.id)) {
        btninteraction.reply({ content: 'It\'s not your turn!', ephemeral: true });
        return;
      }
      await btninteraction.deferUpdate().catch(err => logger.error(err));
      const btn = btns[btninteraction.customId];
      if (btn.toJSON().style == ButtonStyle.Secondary) {
        btn.setStyle(turn ? ButtonStyle.Danger : ButtonStyle.Primary)
          .setEmoji({ id: turn ? x : o })
          .setDisabled(true);
      }
      turn = !turn ? 1 : 0;
      TicTacToe.setColor(turn ? 0xff0000 : 0x0000ff)
        .setFields([{ name: `${turn ? 'X' : 'O'}'s turn`, value: `${turn ? xuser : ouser}` }])
        .setThumbnail(turn ? xuser.user.avatarURL() : ouser.user.avatarURL());
      // 2 = empty / 4 = X / 1 = O
      const reslist = Object.keys(btns).map(i => btns[i].toJSON().style);

      // Evaluate the board
      const win = evalXO(reslist);
      if (win.rows) { win.rows.forEach(i => btns[i].setStyle(ButtonStyle.Success)); }
      if (win.winner) {
        const xwin = win.winner == 'x';
        Object.keys(btns).map(i => { btns[i].setDisabled(true); });
        TicTacToe.setColor(xwin ? 0xff0000 : 0x0000ff)
          .setFields([{ name: 'Result:', value: `${xwin ? xuser : ouser} wins!` }])
          .setThumbnail(xwin ? xuser.user.avatarURL() : ouser.user.avatarURL());
        rows.push(again);
        await btninteraction.editReply({ content: `${xwin ? xuser : ouser}`, embeds: [TicTacToe], components: rows, allowedMentions: { repliedUser: xwin } });
        return collector.stop();
      }

      // check for draw
      let draw = true;
      Object.keys(btns).map(i => {
        if (!btns[i].toJSON().disabled) { draw = false; }
      });
      if (draw) {
        TicTacToe.setColor(0x2f3136)
          .setFields([{ name: 'Result:', value: 'Draw!' }])
          .setThumbnail(null);
        rows.push(again);
        return await interaction.editReply({ content: null, embeds: [TicTacToe], components: rows }) && collector.stop();
      }

      // Go on to next turn if no matches
      await btninteraction.editReply({ content: `${turn ? xuser : ouser}`, embeds: [TicTacToe], components: rows, allowedMentions: { repliedUser: !!turn } });

      // Ping the user
      try {
        const pingmsg = await btninteraction.channel!.send({ content: `${turn ? xuser : ouser}` });
        await pingmsg.delete();
      }
      catch (err) {
        logger.warn(err);
      }
    });

    // When the collector stops, edit the message with a timeout message if the game hasn't ended already
    collector.on('end', () => {
      if (TicTacToe.toJSON().fields![0].name == 'Result:') { return; }
      interaction.editReply({ content: 'A game of tic tac toe should not last longer than two hours...', components: [], embeds: [] }).catch(err => logger.warn(err));
    });
  },
};