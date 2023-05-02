import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, GuildMember, ComponentType, ButtonInteraction, StringSelectMenuInteraction } from 'discord.js';
import action from '~/functions/action';
import actions from '~/misc/actions.json';
import { x } from '~/misc/emoji.json';
import { ContextMenuCommand } from '~/types/Objects';

export const context: ContextMenuCommand<'User'> = {
  name: 'Do action on user',
  noDefer: true,
  type: 'User',
  async execute(interaction, client, member) {
    try {
      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents([
          new StringSelectMenuBuilder()
            .setCustomId('action')
            .setPlaceholder('Select an action!')
            .addOptions([
              new StringSelectMenuOptionBuilder()
                .setLabel(`AWOOGA at ${member.displayName}`)
                .setEmoji({ name: '👀' })
                .setValue('action_awooga'),
              new StringSelectMenuOptionBuilder()
                .setLabel(`Bite ${member.displayName}`)
                .setEmoji({ name: '👅' })
                .setValue('action_bite'),
              new StringSelectMenuOptionBuilder()
                .setLabel(`Bonk ${member.displayName}`)
                .setEmoji({ name: '🔨' })
                .setValue('action_bonk'),
              new StringSelectMenuOptionBuilder()
                .setLabel(`Giggle at ${member.displayName}`)
                .setEmoji({ name: '🤭' })
                .setValue('action_giggle'),
              new StringSelectMenuOptionBuilder()
                .setLabel(`Hug ${member.displayName}`)
                .setEmoji({ name: '🤗' })
                .setValue('action_hug'),
              new StringSelectMenuOptionBuilder()
                .setLabel(`Kill ${member.displayName}`)
                .setEmoji({ name: '🔪' })
                .setValue('action_kill'),
              new StringSelectMenuOptionBuilder()
                .setLabel(`Kiss ${member.displayName}`)
                .setEmoji({ name: '😘' })
                .setValue('action_kiss'),
              new StringSelectMenuOptionBuilder()
                .setLabel(`Lick ${member.displayName}`)
                .setEmoji({ name: '👅' })
                .setValue('action_lick'),
              new StringSelectMenuOptionBuilder()
                .setLabel(`Be mad at ${member.displayName}`)
                .setEmoji({ name: '😡' })
                .setValue('action_mad'),
              new StringSelectMenuOptionBuilder()
                .setLabel(`Nuzzle ${member.displayName}`)
                .setEmoji({ name: '🤗' })
                .setValue('action_nuzzle'),
              new StringSelectMenuOptionBuilder()
                .setLabel(`Stare at ${member.displayName}`)
                .setEmoji({ name: '😐' })
                .setValue('action_stare'),
            ]),
        ]);
      const nvm = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setCustomId('cancel')
            .setEmoji({ id: x })
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger),
        ]);

      const selectmsg = await interaction.reply({ content: `**Please select an action to do on ${member.displayName}**`, components: [row, nvm] });

      const filter = (i: ButtonInteraction | StringSelectMenuInteraction) => i.customId == 'action' || i.customId == 'cancel';
      const collectorButton = selectmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 120000 });
      const collectorSelect = selectmsg.createMessageComponentCollector<ComponentType.StringSelect>({ filter, time: 120000 });
      collectorButton.on('collect', async btnint => {
        if (btnint.customId == 'cancel') {
          btnint.message.delete();
          collectorSelect.stop();
          collectorButton.stop();
          return;
        }
      });
      collectorSelect.on('collect', async selint => {
        const actionName = selint.values[0].split('_')[1];
        action(selint.message, selint.member as GuildMember, [member.id], actionName as keyof typeof actions);
        collectorSelect.stop();
        collectorButton.stop();
      });
    }
    catch (err) { error(err, interaction); }
  },
};