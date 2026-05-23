import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, ContainerBuilder, MessageFlags } from 'discord.js';
import { empty } from '~/misc/emoji.json';
import { Command } from '~/types/Objects';
import text from '~/options/text';

export const buttons: Command = {
  description: 'ya just buttons idk',
  cooldown: 10,
  options: text,
  async execute(interaction) {
    const [rowsInput, columnsInput] = interaction.options.getString('text', true).split('x');
    const rowsAmt = Number(rowsInput);
    const columnsAmt = Number(columnsInput);
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
            .setEmoji({ id: empty })
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