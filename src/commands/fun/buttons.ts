import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, ContainerBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { Empty } from '~/dict/emoji';
import { Command } from '~/lists/Objects';

export const buttons: Command = {
  description: 'ya just buttons idk',
  cooldown: 10,
  cmd: new SlashCommandBuilder()
    .addStringOption(stringOption => stringOption
      .setName('rows')
      .setDescription('The number of rows')
      .setRequired(true),
    )
    .addStringOption(stringOption => stringOption
      .setName('columns')
      .setDescription('The number of columns')
      .setRequired(true),
    ),
  async execute(interaction) {
    const rowsAmt = Number(interaction.options.getString('rows', true));
    const columnsAmt = Number(interaction.options.getString('columns', true));
    if (isNaN(rowsAmt) || isNaN(columnsAmt) || rowsAmt == 0 || columnsAmt == 0) {
      error('Invalid Argument. Please specify the number of rows and columns (ex: 5x5)', interaction, true);
      return;
    }
    if (rowsAmt > 5 || columnsAmt > 5) {
      error('The maximum size of the board is 5x5 due to Discord limitations', interaction, true);
      return;
    }

    // construct buttons and rows
    const btns: { [key: string]: ButtonBuilder | undefined; } = {};
    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    await Promise.all(
      Array.from({ length: rowsAmt }, (_, i) => i + 1).map(row => {
        const ActionRow = new ActionRowBuilder<ButtonBuilder>();
        Array.from({ length: columnsAmt }, (_, i) => i + 1).map(column => {
          const index = `${row}${column}`;
          btns[index] = new ButtonBuilder()
            .setCustomId(index)
            .setEmoji({ id: Empty.id })
            .setStyle(ButtonStyle.Secondary);
          ActionRow.addComponents(btns[index]!);
        });
        rows.push(ActionRow);
      }),
    );

    // create container for the buttons
    const ButtonsContainer = new ContainerBuilder()
      .addActionRowComponents(rows);
    const btnMsg = await interaction.reply({ components: [ButtonsContainer], flags: [MessageFlags.IsComponentsV2] });

    // create collector for the buttons
    const filter = (i: ButtonInteraction) => i.user.id == interaction.user.id;
    const collector = btnMsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 300000 });
    collector.on('collect', async btnInt => {
      await btnInt.deferUpdate();

      const btn = btns[btnInt.customId as keyof typeof btns]!;
      const btnStyle = btn.toJSON().style;
      switch (btnStyle) {
      case ButtonStyle.Secondary:
        btn.setStyle(ButtonStyle.Danger);
        break;
      case ButtonStyle.Danger:
        btn.setStyle(ButtonStyle.Primary);
        break;
      case ButtonStyle.Primary:
        btn.setStyle(ButtonStyle.Success);
        break;
      case ButtonStyle.Success:
        btn.setStyle(ButtonStyle.Secondary);
        break;
      }

      btnInt.editReply({ components: [ButtonsContainer], flags: [MessageFlags.IsComponentsV2] });
    });
  },
};