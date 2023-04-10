import { EmbedBuilder, GuildMemberRoleManager, User, TextChannel } from 'discord.js';
import { Modal } from 'types/Objects';

export const kick: Modal = {
  deferReply: true,
  ephemeral: true,
  execute: async (interaction, client, memberId) => {
    try {
      // Get user and check if user is valid
      let member = interaction.guild!.members.cache.get(memberId);
      if (!member) { member = await interaction.guild!.members.fetch(memberId); }
      if (!member) { return error('Invalid member! Are they in this server?', interaction, true); }

      // Get member and author and check if role is lower than member's role
      const author = interaction.member!;
      if (!author || !(author.roles instanceof GuildMemberRoleManager)) return;
      const authorTag = author.user instanceof User ? author.user.tag : `${author.user.username}#${author.user.discriminator}`;

      if (member.roles.highest.rawPosition > author.roles.highest.rawPosition) { return error(`You can't do that! Your role is ${member.roles.highest.rawPosition - author.roles.highest.rawPosition} positions lower than the user's role!`, interaction, true); }
      if (member.roles.highest.rawPosition > member.guild.members.me!.roles.highest.rawPosition) { return error(`I can't do that! My role is ${member.roles.highest.rawPosition - member.guild.members.me!.roles.highest.rawPosition} positions lower than the user's role!`, interaction, true); }

      // Create embed
      const KickEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Kicked ${member.user.tag}.`);

      // Add reason if specified
      const reason = interaction.fields.getTextInputValue('reason');
      if (reason) { KickEmbed.addFields([{ name: 'Reason', value: reason }]); }

      // Send kick message to target
      await member.send({ content: `**You've been kicked from ${interaction.guild!.name}.${reason ? ` Reason: ${reason}` : ''}**` })
        .catch(err => {
          logger.warn(err);
          interaction.reply({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
        });

      // Reply with response
      await interaction.reply({ embeds: [KickEmbed] });

      // Actually kick the dude
      await member.kick(`Kicked by ${authorTag} for ${reason}`);
      logger.info(`Kicked user: ${member.user.tag} from ${interaction.guild!.name}`);

      // Check if log channel exists and send message
      const srvconfig = await sql.getData('settings', { guildId: interaction.guild!.id });
      const logchannel = interaction.guild!.channels.cache.get(srvconfig.logchannel) as TextChannel;
      if (logchannel) {
        KickEmbed.setTitle(`${authorTag} ${KickEmbed.toJSON().title}`);
        logchannel.send({ embeds: [KickEmbed] });
      }
    }
    catch (err) { error(err, interaction); }
  },
};