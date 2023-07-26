import { BaseGuildTextChannel, Client, EmbedBuilder, Guild } from 'discord.js';

export default async (client: Client, guild: Guild) => {
  logger.info(`${client.user?.username} has been added to ${guild.name}`);
  const owner = await guild.fetchOwner();
  const createdTimestamp = Math.round(guild.createdTimestamp / 1000);
  const AddEmbed = new EmbedBuilder()
    .setColor('Random')
    .setTitle(`${client.user?.username} has been added to ${guild.name}`)
    .setThumbnail(guild.iconURL())
    .setFooter({ text: `Owner: ${owner.user.username}`, iconURL: owner.user?.avatarURL() ?? undefined })
    .setDescription(`This guild has ${guild.memberCount} members and is level ${guild.premiumTier}\n${client.user?.username} is now in ${client.guilds.cache.size} servers`)
    .addFields([
      { name: 'Created at', value: `<t:${createdTimestamp}>\n<t:${createdTimestamp}:R>`, inline: true },
      { name: 'Locale', value: guild.preferredLocale, inline: true },
    ]);
  if (guild.vanityURLCode) AddEmbed.addFields([{ name: 'Vanity URL', value: `https://discord.gg/${guild.vanityURLCode}\n(${guild.vanityURLUses} uses)`, inline: true }]);
  if (guild.splash) AddEmbed.setImage(guild.discoverySplashURL());
  const logchannel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('865682839616618506') as BaseGuildTextChannel;
  logchannel.send({ embeds: [AddEmbed] });
};