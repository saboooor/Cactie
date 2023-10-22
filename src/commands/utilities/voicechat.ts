import { CategoryChannel, ChannelType, OverwriteResolvable, PermissionFlagsBits, VoiceChannel } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import vcOptions from '~/options/voicechat';
import prisma, { getGuildConfig } from '~/functions/prisma';

export const voicechat: SlashCommand<'cached'> = {
  description: 'Create a personal voice chat!',
  cooldown: 10,
  options: vcOptions,
  botPerms: ['ManageChannels'],
  async execute(interaction) {
    try {
      const cmd = interaction.options.getSubcommand();

      let existingVC = await prisma.voicechats.findUnique({
        where: {
          guildId_ownerId: {
            guildId: interaction.guild.id,
            ownerId: interaction.user.id,
          },
        },
      });
      let vc = existingVC ? interaction.guild.channels.cache.get(existingVC.channelId) as VoiceChannel | undefined : undefined;
      if (existingVC && !vc) {
        await prisma.voicechats.delete({ where: { channelId: existingVC.channelId } });
        existingVC = null;
      }

      if (cmd == 'create') {
        const srvconfig = await getGuildConfig(interaction.guild.id);

        const name = interaction.options.getString('name', true);
        const userLimit = interaction.options.getNumber('limit', false) ?? undefined;

        if (existingVC) {
          interaction.reply({ content: `**You already have a voice chat at <#${existingVC.channelId}>!**` });
          return;
        }

        const permissionOverwrites: OverwriteResolvable[] = [
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.DeafenMembers,
              PermissionFlagsBits.MuteMembers,
              PermissionFlagsBits.MoveMembers,
            ],
          },
        ];

        if (srvconfig.voicechats.type == 'private') {
          permissionOverwrites.push({
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          });
        }

        const parent = interaction.guild.channels.cache.get(srvconfig.voicechats.category) as CategoryChannel | undefined;
        vc = await interaction.guild.channels.create({
          name, userLimit, parent,
          type: ChannelType.GuildVoice,
          permissionOverwrites,
        });

        await prisma.voicechats.create({
          data: {
            channelId: vc.id,
            guildId: interaction.guild.id,
            ownerId: interaction.user.id,
          },
        });

        interaction.reply({ content: `**Your voice chat has been created at ${vc}!**\nTo edit the channel, you can directly use Discord's edit channel interface.` });
        return;
      }

      if (!vc) {
        interaction.reply({ content: '**You don\'t have a voice chat!**' });
        return;
      }

      if (cmd == 'delete') {
        await vc.delete();
        await prisma.voicechats.delete({ where: { channelId: vc.id } });

        interaction.reply({ content: '**Your voice chat has been deleted!**' });
        return;
      }

      const user = interaction.options.getUser('user', true);

      if (cmd == 'add-user') {
        await vc.permissionOverwrites.edit(user.id, { ViewChannel: true });
        await interaction.reply({ content: `**${user} has been added to ${vc}!**` });
        await user.send({ content: `**You have been added to ${vc} in ${interaction.guild.name}!**` });
      }

      if (cmd == 'remove-user') {
        await vc.permissionOverwrites.edit(user.id, { ViewChannel: false });
        await interaction.reply({ content: `${user} has been removed from ${vc}!` });
        vc.members.get(user.id)?.voice.setChannel(null);
      }
    }
    catch (err) { error(err, interaction); }
  },
};