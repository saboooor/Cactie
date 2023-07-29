import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, ComponentType, GuildMember } from 'discord.js';
import { refresh } from '~/misc/emoji.json';
import { SlashCommand } from '~/types/Objects';
import userOption from '~/options/user';

export const avatar: SlashCommand = {
  description: 'Get the avatar of a user',
  options: userOption,
  async execute(interaction) {
    try {
      let member = interaction.options.getMember('user') ?? interaction.member;
      if (!(member instanceof GuildMember)) member = null;
      let user = interaction.options.getUser('user') ?? interaction.user;
      user = await user.fetch();

      const memberpfp = member?.avatarURL({ size: 1024 });
      const userpfp = user.avatarURL({ size: 1024 });
      const UsrEmbed = new EmbedBuilder()
        .setColor(user.accentColor ?? null)
        .setAuthor({ name: `${member?.displayName && member.displayName != user.username ? `${member.displayName} (${member.user.username})` : user.username}`, iconURL: memberpfp ? userpfp ?? undefined : undefined })
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
      const avatarmsg = await interaction.reply({ embeds: [UsrEmbed], components: row });

      if (memberpfp) {
        const filter = (i: ButtonInteraction) => i.customId == 'avatar_user';
        const collector = avatarmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 60000 });

        collector.on('collect', async btnint => {
          // Check if the button is the avatar button
          await btnint.deferUpdate();

          // Toggle profile pic
          if (UsrEmbed.toJSON().image?.url == memberpfp) btnint.editReply({ embeds: [UsrEmbed.setImage(userpfp).setAuthor({ name: UsrEmbed.toJSON().author!.name, iconURL: memberpfp })] });
          else if (UsrEmbed.toJSON().image?.url == userpfp) btnint.editReply({ embeds: [UsrEmbed.setImage(memberpfp).setAuthor({ name: UsrEmbed.toJSON().author!.name, iconURL: userpfp })] });
        });

        // When the collector stops, remove all buttons from it
        collector.on('end', () => {
          interaction.editReply({ components: [] }).catch(err => logger.warn(err));
        });
      }
    }
    catch (err) { error(err, interaction); }
  },
};