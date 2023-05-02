import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';
import { empty } from '~/misc/emoji.json';
import { SlashCommand } from '~/types/Objects';
import text from '~/options/text';

export const buttons: SlashCommand = {
  description: 'ya just buttons idk',
  voteOnly: true,
  args: true,
  usage: '<Rows and Columns (ex: 5x5)>',
  cooldown: 10,
  options: text,
  async execute(message, args) {
    const btns: any = {};
    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    const [ro, co] = args[0].split('x');
    if (isNaN(Number(ro)) || isNaN(Number(co)) || ro == '0' || co == '0') {
      error('Invalid Argument. Please specify the number of rows and columns (ex: 5x5)', message, true);
      return;
    }
    if (Number(ro) > 5 || Number(co) > 5) {
      error('The maximum size of the board is 5x5 due to Discord limitations', message, true);
      return;
    }
    for (let row = 0; row < parseInt(ro); row++) {
      rows.push(new ActionRowBuilder<ButtonBuilder>());
      for (let column = 0; column < parseInt(co); column++) {
        btns[`${column}${row}`] = new ButtonBuilder()
          .setCustomId(`${column}${row}`)
          .setEmoji({ id: empty })
          .setStyle(ButtonStyle.Secondary);
        rows[row].addComponents([btns[`${column}${row}`]]);
      }
    }
    const btnMsg = await message.reply({ content: '\u200b', components: rows });
    const filter = (i: ButtonInteraction) => i.user.id == message.member!.user.id;
    const collector = btnMsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 300000 });
    collector.on('collect', async i => {
      await i.deferUpdate();
      const btn = btns[i.customId];
      if (btn.toJSON().style == ButtonStyle.Secondary) btn.setStyle(ButtonStyle.Danger);
      else if (btn.toJSON().style == ButtonStyle.Danger) btn.setStyle(ButtonStyle.Primary);
      else if (btn.toJSON().style == ButtonStyle.Primary) btn.setStyle(ButtonStyle.Success);
      else if (btn.toJSON().style == ButtonStyle.Success) btn.setStyle(ButtonStyle.Secondary);
      i.editReply({ components: rows });
    });
  },
};