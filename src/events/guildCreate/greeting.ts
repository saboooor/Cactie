import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Guild } from 'discord.js';

export default async (client: Client, guild: Guild) => {
  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents([
      new ButtonBuilder()
        .setURL('https://sova.fyi')
        .setLabel('Dashboard')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL('https://sova.fyi/discord')
        .setLabel('Support Server')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL(`https://top.gg/bot/${client.user?.id}/vote`)
        .setLabel('Vote on top.gg')
        .setStyle(ButtonStyle.Link),
    ]);
  const greetingEmbed = new EmbedBuilder()
    .setColor('Random')
    .setTitle(`Thanks for adding ${client.user?.username} to ${guild.name}!`)
    .setDescription(`
Type \`/help\` for help, and \`/invite\` to invite me to other servers!
Please take some time going through the dashboard so that ${client.user?.username} works well!
		`)
    .setURL('https://sova.fyi');
  const message = { embeds: [greetingEmbed], components: [row] };
  const owner = await guild.fetchOwner();
  if (!guild.systemChannel) owner.send(message).catch(err => logger.warn(err));
  else guild.systemChannel.send(message).catch(err => logger.warn(err));
};