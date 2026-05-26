import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, User } from 'discord.js';
import { x, o, empty, refresh } from '~/misc/emoji.json';
import evalXO from './evalXO';

export default async function createTicTacToe(xUser: User, oUser: User, interaction: ButtonInteraction | CommandInteraction) {
  // set random turn - true = X / false = O
  let turn = Boolean(Math.round(Math.random()));
  let gameEnded = false;

  // construct buttons and rows
  const btns: { [key: string]: ButtonBuilder | undefined; } = {};
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  await Promise.all([1, 2, 3].map(row => {
    const ActionRow = new ActionRowBuilder<ButtonBuilder>();
    [1, 2, 3].map(column => {
      const index = `${row}${column}`;
      btns[index] = new ButtonBuilder()
        .setCustomId(index)
        .setEmoji({ id: empty })
        .setStyle(ButtonStyle.Secondary);
      ActionRow.addComponents(btns[index]!);
    });
    rows.push(ActionRow);
  }));

  // random bot move if bot is playing and it's O's turn
  if (oUser.bot && !turn) {
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
        textDisplay.setContent(`## ${turn ? 'X' : 'O'}'s turn\n${turn ? xUser : oUser}`),
      )
      .setThumbnailAccessory((thumbnail) => thumbnail.setURL(
        (turn ? xUser.avatarURL() : oUser.avatarURL()) ?? '',
      )),
    )
    // actual game
    .addSeparatorComponents((separator) => separator)
    .addActionRowComponents(rows)
    .addSeparatorComponents((separator) => separator)
    // legend (index 6)
    .addTextDisplayComponents((textDisplay) =>
      textDisplay.setContent(`**X:** ${xUser}\n**O:** ${oUser}`),
    );

  const TicTacToeMsg = await interaction.editReply({ components: [TicTacToeContainer], flags: MessageFlags.IsComponentsV2 });

  // create collector for buttons
  const filter = (i: ButtonInteraction) => !i.customId.startsWith('tictactoe_again');
  const collector = TicTacToeMsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });

  const againButton = new ButtonBuilder()
    .setCustomId(`tictactoe_again|${xUser.id}|${oUser.id}`)
    .setEmoji({ id: refresh })
    .setLabel('Play Again')
    .setStyle(ButtonStyle.Secondary);

  collector.on('collect', async (btnint: ButtonInteraction) => {
    // check if it's the correct user's turn
    if (btnint.user.id != (turn ? xUser.id : oUser.id)) {
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

    if (oUser.bot && !turn) {
      const whichButton = Object.keys(btns)[Math.floor(Math.random() * Object.keys(btns).length)];
      btns[whichButton as keyof typeof btns]?.setEmoji({ id: o }).setStyle(ButtonStyle.Primary).setDisabled(true);
      turn = !turn;
    }

    TicTacToeContainer.setAccentColor(turn ? 0xff0000 : 0x00ff00);

    TicTacToeContainer.components[0] = new SectionBuilder()
      .addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent(`## ${turn ? 'X' : 'O'}'s turn\n${turn ? xUser : oUser}`),
      )
      .setThumbnailAccessory((thumbnail) => thumbnail.setURL(
        (turn ? xUser.avatarURL() : oUser.avatarURL()) ?? '',
      ));

    // update the buttons in the container
    TicTacToeContainer.components[2] = rows[0]!;
    TicTacToeContainer.components[3] = rows[1]!;
    TicTacToeContainer.components[4] = rows[2]!;

    // 2 = empty / 4 = X / 1 = O
    const reslist = Object.keys(btns).map(i => btns[i as keyof typeof btns]!.toJSON().style);

    // Evaluate the board
    const win = evalXO(reslist);
    if (win.rows) { win.rows.forEach(i => btns[i.toString() as keyof typeof btns]!.setStyle(ButtonStyle.Success)); }
    if (win.winner) {
      gameEnded = true;
      const XIsWinner = win.winner == 'x';
      Object.keys(btns).map(i => btns[i as keyof typeof btns]!.setDisabled(true));
      TicTacToeContainer.setAccentColor(XIsWinner ? 0xff0000 : 0x00ff00)
        .addSeparatorComponents((separator) => separator)
        .addSectionComponents((section) => section
          .addTextDisplayComponents((textDisplay) =>
            textDisplay.setContent(`**Result:** ${XIsWinner ? xUser : oUser} wins!`),
          )
          .setThumbnailAccessory((thumbnail) => thumbnail.setURL(
            (XIsWinner ? xUser.avatarURL() : oUser.avatarURL()) ?? '',
          ))
          .setButtonAccessory(againButton),
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
      gameEnded = true;
      TicTacToeContainer.setAccentColor(0x2f3136)
        .addSectionComponents((section) => section
          .addTextDisplayComponents((textDisplay) =>
            textDisplay.setContent('**Result:** Draw!'),
          )
          .setButtonAccessory(againButton),
        );
      await btnint.editReply({ components: [TicTacToeContainer], flags: MessageFlags.IsComponentsV2 });
      return collector.stop();
    }

    // Go on to next turn if no matches
    await btnint.editReply({ components: [TicTacToeContainer], flags: MessageFlags.IsComponentsV2 });

    // Ping the user
    try {
      if (btnint.channel && 'send' in btnint.channel) {
        const pingmsg = await btnint.channel.send({ content: `${turn ? xUser : oUser}` });
        await pingmsg.delete();
      }
    }
    catch (err) {
      logger.warn(err);
    }
  });

  // When the collector stops, edit the message with a timeout message if the game hasn't ended already
  collector.on('end', () => {
    // check if the game has already ended, if it has, do nothing
    if (gameEnded) return;

    // disable all buttons and show timeout message
    Object.keys(btns).map(i => btns[i as keyof typeof btns]!.setDisabled(true));
    TicTacToeContainer
      .setAccentColor(0x2f3136)
      .addSeparatorComponents((separator) => separator)
      .addSectionComponents((section) => section
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent('**Game Over:** Time ran out!'),
        )
        .setButtonAccessory(againButton),
      );
    TicTacToeMsg.edit({ components: [TicTacToeContainer], flags: MessageFlags.IsComponentsV2 });
  });
}