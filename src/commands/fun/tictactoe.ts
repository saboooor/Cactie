import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, ComponentType, ContainerBuilder, MessageFlags, SectionBuilder } from 'discord.js';
import { x, o, empty, refresh } from '~/misc/emoji.json';
import evalXO from '~/functions/evalXO';
import userOption from '~/options/user';
import { Command } from '~/types/Objects';
const again = new ButtonBuilder()
  .setCustomId('xo_again')
  .setEmoji({ id: refresh })
  .setLabel('Play Again')
  .setStyle(ButtonStyle.Secondary);

export const tictactoe: Command<'cached'> = {
  description: 'Play Tic Tac Toe',
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

    // set random turn - true = X / false = O
    let turn = Boolean(Math.round(Math.random()));

    // construct buttons and rows
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
        rows[row - 1]?.addComponents([btns[`${column}${row}` as keyof typeof btns]!]);
      }
    }

    if (user.bot && !turn) {
      const whichButton = Object.keys(btns)[Math.floor(Math.random() * Object.keys(btns).length)];
      btns[whichButton as keyof typeof btns]?.setEmoji({ id: o }).setStyle(ButtonStyle.Primary).setDisabled(true);
      turn = !turn;
    }

    // create container for the game
    const TicTacToeContainer = new ContainerBuilder()
      .setAccentColor(turn ? 0xff0000 : 0x00ff00)
      // Title section with turn info and thumbnail
      .addSectionComponents((section) => section
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent(`## ${turn ? 'X' : 'O'}'s turn\n${turn ? interaction.user : user}`),
        )
        .setThumbnailAccessory((thumbnail) => thumbnail.setURL(
          (turn ? interaction.user.avatarURL() : user.avatarURL()) ?? '',
        )),
      )
      // actual game
      .addSeparatorComponents((separator) => separator)
      .addActionRowComponents(rows[0]!)
      .addActionRowComponents(rows[1]!)
      .addActionRowComponents(rows[2]!)
      .addSeparatorComponents((separator) => separator)
      // legend
      .addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent(`**X:** ${interaction.user}\n**O:** ${user}`),
      );

    // send message
    const TicTacToeMsg = await interaction.reply({ components: [TicTacToeContainer], flags: MessageFlags.IsComponentsV2 });

    // create collector for buttons
    const filter = (i: ButtonInteraction) => i.customId != 'xo_again';
    const collector = TicTacToeMsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });

    collector.on('collect', async (btnint: ButtonInteraction) => {
      // check if it's the correct user's turn
      if (btnint.user.id != (turn ? interaction.user.id : interaction.id)) {
        btnint.reply({ content: 'It\'s not your turn!', flags: ['Ephemeral'] });
        return;
      }

      // defer update to give more time to process the button interaction
      await btnint.deferUpdate().catch((err: Error) => logger.error(err));

      // get the button that was clicked and update it based on the current turn
      const btn = btns[btnint.customId as keyof typeof btns]!;
      if (btn.toJSON().style == ButtonStyle.Secondary) {
        btn.setStyle(turn ? ButtonStyle.Danger : ButtonStyle.Primary)
          .setEmoji({ id: turn ? x : o })
          .setDisabled(true);
      }

      // switch turn and update container color and title
      turn = !turn;

      if (user.bot && !turn) {
        const whichButton = Object.keys(btns)[Math.floor(Math.random() * Object.keys(btns).length)];
        btns[whichButton as keyof typeof btns]?.setEmoji({ id: o }).setStyle(ButtonStyle.Primary).setDisabled(true);
        turn = !turn;
      }

      TicTacToeContainer.setAccentColor(turn ? 0xff0000 : 0x00ff00);

      TicTacToeContainer.components[0] = new SectionBuilder()
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent(`## ${turn ? 'X' : 'O'}'s turn\n${turn ? interaction.user : user}`),
        )
        .setThumbnailAccessory((thumbnail) => thumbnail.setURL(
          (turn ? interaction.user.avatarURL() : user.avatarURL()) ?? '',
        ));

      TicTacToeContainer.components[2] = rows[0]!;
      TicTacToeContainer.components[3] = rows[1]!;
      TicTacToeContainer.components[4] = rows[2]!;

      // 2 = empty / 4 = X / 1 = O
      const reslist = Object.keys(btns).map(i => btns[i as keyof typeof btns]!.toJSON().style);

      // Evaluate the board
      const win = evalXO(reslist);
      if (win.rows) { win.rows.forEach(i => btns[i.toString() as keyof typeof btns]!.setStyle(ButtonStyle.Success)); }
      if (win.winner) {
        const XIsWinner = win.winner == 'x';
        Object.keys(btns).map(i => { btns[i as keyof typeof btns]!.setDisabled(true); });
        TicTacToeContainer.setAccentColor(XIsWinner ? 0xff0000 : 0x00ff00)
          .addSeparatorComponents((separator) => separator)
          .addSectionComponents((section) => section
            .addTextDisplayComponents((textDisplay) =>
              textDisplay.setContent(`**Result:** ${XIsWinner ? interaction.user : user} wins!`),
            )
            .setThumbnailAccessory((thumbnail) => thumbnail.setURL(
              (XIsWinner ? interaction.user.avatarURL() : user.avatarURL()) ?? '',
            ))
            .setButtonAccessory(again),
          );
        await btnint.editReply({ components: [TicTacToeContainer], flags: MessageFlags.IsComponentsV2 });
        return collector.stop();
      }

      // check for draw
      let draw = true;
      Object.keys(btns).map(i => {
        if (!btns[i as keyof typeof btns]!.toJSON().disabled) { draw = false; }
      });
      if (draw) {
        TicTacToeContainer.setAccentColor(0x2f3136)
          .addSectionComponents((section) => section
            .addTextDisplayComponents((textDisplay) =>
              textDisplay.setContent('**Result:** Draw!'),
            )
            .setButtonAccessory(again),
          );
        await btnint.editReply({ components: [TicTacToeContainer], flags: MessageFlags.IsComponentsV2 });
        return collector.stop();
      }

      // Go on to next turn if no matches
      await btnint.editReply({ components: [TicTacToeContainer], flags: MessageFlags.IsComponentsV2 });

      // Ping the user
      try {
        if (btnint.channel && 'send' in btnint.channel) {
          const pingmsg = await btnint.channel.send({ content: `${turn ? interaction.user : user}` });
          await pingmsg.delete();
        }
      }
      catch (err) {
        logger.warn(err);
      }
    });

    // When the collector stops, edit the message with a timeout message if the game hasn't ended already
    collector.on('end', () => {
      if (TicTacToeContainer.components.length <= 7) return;
      interaction.editReply({ content: 'A game of tic tac toe should not last longer than two hours...', components: [], embeds: [] }).catch(err => logger.warn(err));
    });
  },
};