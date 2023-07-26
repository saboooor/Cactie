import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '~/types/Objects';

export const server: SlashCommand<'cached'> = {
  description: 'Discord server info',
  cooldown: 10,
  async execute(interaction) {
    try {
      const owner = await interaction.guild.fetchOwner();
      const srvEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(interaction.guild.name)
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ text: `Owner: ${owner.user.username}`, iconURL: owner.user.avatarURL() ?? undefined });
      if (interaction.guild.description) srvEmbed.addFields([{ name: 'Description', value: interaction.guild.description }]);
      if (interaction.guild.vanityURLCode) srvEmbed.addFields([{ name: 'Vanity URL', value: `discord.gg/${interaction.guild.vanityURLCode}` }]);
      const timestamp = Math.round(interaction.guild.createdTimestamp / 1000);
      srvEmbed.addFields([
        { name: 'Members', value: `${interaction.guild.memberCount}` },
        { name: 'Channels', value: `${interaction.guild.channels.cache.size}` },
        { name: 'Created At', value: `<t:${timestamp}>\n<t:${timestamp}:R>` },
      ]);
      await interaction.reply({ embeds: [srvEmbed] });
    }
    catch (err) { error(err, interaction); }
  },
};