import { EmbedBuilder, TextChannel } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import unbanOptions from '~/options/unban';
import { getGuildConfig } from '~/functions/prisma';

export const unban: SlashCommand<'cached'> = {
  description: 'Unban someone that was banned from the server',
  ephemeral: true,
  permissions: ['BanMembers'],
  botPerms: ['BanMembers'],
  cooldown: 5,
  options: unbanOptions,
  async autoComplete(client, interaction) {
    // Fetch bans from guild and check if user in arg is banned
    const bans = await interaction.guild.bans.fetch();
    const list = bans.map(ban => ({ name: ban.user.username, value: ban.user.id }));

    // Get the focused option
    const focusedValue = interaction.options.getFocused();

    // Filter the choices by the search query
    const filtered = list.filter(choice => choice.name.toLowerCase().startsWith(focusedValue.toLowerCase()));

    // If the amount of choices is 25, truncate with __ more results
    if (filtered.length > 25) {
      const more = filtered.length - 24;
      filtered.length = 24;
      filtered.push({ name: `${more} more results, please type a more specific query.`, value: '0' });
    }

    interaction.respond(filtered);
  },
  async execute(interaction, args, client) {
    try {
      // Fetch bans from guild and check if user in arg is banned
      const bans = await interaction.guild.bans.fetch();
      const ban = bans.get(args[0].replace(/\D/g, ''));
      if (!ban) {
        error('Invalid User! / This user hasn\'t been banned!', interaction, true);
        return;
      }

      // Send unban message to user if they can be fetched by the client
      const bannedUser = client.users.cache.get(ban.user.id);
      if (bannedUser) {
        await bannedUser.send({ content: `**You've been unbanned in ${interaction.guild.name}**` })
          .catch(err => {
            logger.warn(err);
            interaction.reply({ content: 'Could not DM user! You may have to manually let them know that they have been unbanned.' });
          });
      }

      // Actually unban the dude
      interaction.guild.members.unban(ban.user.id);

      // Create embed with color and title
      const UnbanEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Unbanned ${ban.user.username}`);

      // Reply with unban log
      interaction.reply({ embeds: [UnbanEmbed] });
      logger.info(`Unbanned user: ${ban.user.username} in ${interaction.guild.name}`);

      // Check if log channel exists and send message
      // Get server config
      const srvconfig = await getGuildConfig(interaction.guild.id);
      const logchannel = interaction.guild.channels.cache.get(srvconfig.logchannel) as TextChannel | undefined;
      if (logchannel) {
        UnbanEmbed.setTitle(`${interaction.user.username} ${UnbanEmbed.toJSON().title}`);
        logchannel.send({ embeds: [UnbanEmbed] });
      }
    }
    catch (err) { error(err, interaction); }
  },
};