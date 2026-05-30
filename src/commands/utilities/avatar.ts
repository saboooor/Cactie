import { GuildMember, MediaGalleryBuilder, ContainerBuilder, MessageFlags } from 'discord.js';
import { Command } from '~/lists/Objects';
import userOption from '~/options/user';
import { UserRound } from '~/dict/emoji';

export const avatar: Command = {
  description: 'Get the avatar of a user',
  options: userOption,
  async execute(interaction) {
    try {
      let member = interaction.options.getMember('user') ?? interaction.member;
      if (!(member instanceof GuildMember)) member = null;

      let user = interaction.options.getUser('user') ?? interaction.user;
      user = await user.fetch();

      const memberpfp = member?.avatarURL({ size: 4096 });
      const userpfp = user.avatarURL({ size: 4096 });

      const Gallery = new MediaGalleryBuilder();
      if (memberpfp) Gallery.addItems(galleryItem =>
        galleryItem.setURL(memberpfp!).setDescription(`${member!.displayName}'s Server Avatar`),
      );
      Gallery.addItems(galleryItem =>
        galleryItem.setURL(userpfp!).setDescription(`${user.username}'s Personal Avatar`),
      );

      const name = `${member?.displayName && member.displayName != user.username ? `${member.displayName} (${member.user.username})` : user.username}`;

      const AvatarContainer = new ContainerBuilder()
        .addTextDisplayComponents(textDisplay =>
          textDisplay.setContent(`# ${UserRound.getString()} ${name}'s Avatar`),
        )
        .addSeparatorComponents(separator => separator)
        .addMediaGalleryComponents(Gallery);
      if (user.accentColor) AvatarContainer.setAccentColor(user.accentColor);

      await interaction.reply({ components: [AvatarContainer], flags: [MessageFlags.IsComponentsV2] });
    }
    catch (err) { error(err, interaction); }
  },
};