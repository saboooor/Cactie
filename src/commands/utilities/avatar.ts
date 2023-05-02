import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, ButtonInteraction, ComponentType, CommandInteraction } from 'discord.js';
import { refresh } from '~/misc/emoji.json';
import { SlashCommand } from '~/types/Objects';
import user from '~/options/user';

export const avatar: SlashCommand = {
  description: 'Get the avatar of a user',
  aliases: ['pfp', 'av'],
  usage: '[User]',
  options: user,
  async execute(message, args) {
    try {
      let member: GuildMember = message.member as GuildMember;
      if (args.length) member = await message.guild!.members.fetch(args[0].replace(/\D/g, ''));
      if (!member) {
        error('Invalid member! Are they in this server?', message, true);
        return;
      }
      member.user = await member.user.fetch();
      const memberpfp = member.avatarURL({ size: 1024 });
      const userpfp = member.user.avatarURL({ size: 1024 });
      const UsrEmbed = new EmbedBuilder()
        .setColor(member.user.accentColor ?? null)
        .setAuthor({ name: `${member.displayName != member.user.username ? `${member.displayName} (${member.user.tag})` : member.user.tag}`, iconURL: memberpfp ?? userpfp ?? undefined })
        .setImage(memberpfp ? memberpfp : userpfp);
      const row = [];
      if (memberpfp) {
        row.push(
          new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder()
              .setCustomId('avatar_user')
              .setLabel('Toggle Global Avatar')
              .setEmoji({ id: refresh })
              .setStyle(ButtonStyle.Secondary),
          ]),
        );
      }
      const avatarmsg = await message.reply({ embeds: [UsrEmbed], components: row });

      if (memberpfp) {
        const filter = (i: ButtonInteraction) => i.customId == 'avatar_user';
        const collector = avatarmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 60000 });

        collector.on('collect', async interaction => {
          // Check if the button is the avatar button
          await interaction.deferUpdate();

          // Toggle profile pic
          if (UsrEmbed.toJSON().image?.url == memberpfp) interaction.editReply({ embeds: [UsrEmbed.setImage(userpfp).setAuthor({ name: `${member.displayName != member.user.username ? `${member.displayName} (${member.user.tag})` : member.user.tag}`, iconURL: memberpfp })] });
          else if (UsrEmbed.toJSON().image?.url == userpfp) interaction.editReply({ embeds: [UsrEmbed.setImage(memberpfp).setAuthor({ name: `${member.displayName != member.user.username ? `${member.displayName} (${member.user.tag})` : member.user.tag}`, iconURL: userpfp })] });
        });

        // When the collector stops, remove all buttons from it
        collector.on('end', () => {
          if (message instanceof CommandInteraction) message.editReply({ components: [] }).catch(err => logger.warn(err));
          else avatarmsg.edit({ components: [] }).catch(err => logger.warn(err));
        });
      }
    }
    catch (err) { error(err, message); }
  },
};