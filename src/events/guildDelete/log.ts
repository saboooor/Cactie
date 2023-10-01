import { Client, EmbedBuilder, Guild, BaseGuildTextChannel } from 'discord.js';

export default async (client: Client, guild: Guild) => {
  if (!guild.available) return;
  const owner = await guild.fetchOwner();
  const createdTimestamp = Math.round(guild.createdTimestamp / 1000);
  const RemEmbed = new EmbedBuilder()
    .setColor('Random')
    .setTitle(`${client.user?.username} has been removed from ${guild.name}`)
    .setThumbnail(guild.iconURL())
    .setFooter({ text: `Owner: ${owner.user.username}`, iconURL: owner.user?.avatarURL() ?? undefined })
    .setDescription(`${client.user?.username} is now in ${client.guilds.cache.size} servers`)
    .addFields([{ name: 'Created at', value: `<t:${createdTimestamp}>\n<t:${createdTimestamp}:R>` }]);
  const logchannel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('865682839616618506') as BaseGuildTextChannel;
  logchannel.send({ embeds: [RemEmbed] });
};