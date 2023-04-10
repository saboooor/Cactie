import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ContextMenuCommand } from 'types/Objects';

export const context: ContextMenuCommand<'User'> = {
  name: 'Ban Member',
  noDefer: true,
  permissions: ['BanMembers'],
  botPerms: ['BanMembers'],
  type: 'User',
  async execute(interaction, client, member) {
    try {
      // Create and show a modal for the user to fill out the ticket's description
      const modal = new ModalBuilder()
        .setTitle(`Ban ${member.user.tag}`)
        .setCustomId(`ban_${member.id}`)
        .addComponents([
          new ActionRowBuilder<TextInputBuilder>().addComponents([
            new TextInputBuilder()
              .setCustomId('reason')
              .setLabel('Reason')
              .setPlaceholder('No reason given. (Example: Spamming)')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false),
          ]),
          new ActionRowBuilder<TextInputBuilder>().addComponents([
            new TextInputBuilder()
              .setCustomId('time')
              .setLabel('Time')
              .setPlaceholder('Forever. (Examples: 1d, 1h, 1m, 1s)')
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ]),
        ]);
      interaction.showModal(modal);
    }
    catch (err) { error(err, interaction); }
  },
};