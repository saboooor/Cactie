import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import vcOptions from '~/options/voicechat';

export const voicechat: SlashCommand<'cached'> = {
  description: 'Create a personal voice chat!',
  ephemeral: true,
  cooldown: 10,
  options: vcOptions,
  botPerms: ['ManageChannels'],
  async execute(interaction, client) {
    try {
      const cmd = interaction.options.getSubcommand();

      if (cmd == 'create') {
        const name = interaction.options.getString('name', true);

        const vc = await interaction.guild.channels.create({
          name,
          type: ChannelType.GuildVoice,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
          ]
        });

        interaction.reply({ content: `Your voice chat has been created at ${vc}!`, ephemeral: true });
      }
    }
    catch (err) { error(err, interaction); }
  },
};