import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import githubOptions from '~/options/github';

function truncateString(str: string, num: number) {
  if (str.length <= num) return str; return str.slice(0, num - 1) + '…';
}

export const github: SlashCommand = {
  description: 'Get info on any GitHub repository',
  options: githubOptions,
  async autoComplete(client, interaction) {
    const value = interaction.options.getFocused();
    if (!value) return interaction.respond([{ name: 'Invalid Query', value: 'saboooor/Cactie' }]);
    const query = await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=25`, { headers: { 'Accept': 'application/json' } });
    const searchResult = await query.json();
    if (!searchResult.items) return interaction.respond([{ name: value, value }]);
    if (!searchResult.items.length) return interaction.respond([{ name: 'No repos found', value }]);
    const results = searchResult.items.map((item: { full_name: string }) => { return { name: truncateString(item.full_name, 100), value: item.full_name }; });
    interaction.respond(results);
  },
  async execute(interaction) {
    try {
      // fetch the github repo
      const repo = interaction.options.getString('repo', true);
      const repoFetch = await fetch(`https://api.github.com/repos/${repo}`, { headers: { 'Accept': 'application/json' } });
      const repoResult = await repoFetch.json();

      const updatedTimestamp = Math.round(new Date(repoResult.pushed_at).getTime() / 1000);
      const repoEmbed = new EmbedBuilder()
        .setAuthor({ name: repoResult.owner.login, iconURL: repoResult.owner.avatar_url })
        .setTitle(repoResult.name)
        .setDescription(repoResult.description)
        .setURL(repoResult.html_url)
        .setTimestamp(new Date(repoResult.created_at))
        .addFields([
          { name: 'Last Updated', value: `<t:${updatedTimestamp}>\n<t:${updatedTimestamp}:R>`, inline: true },
          { name: 'Size', value: `${repoResult.size / 1000} MB`, inline: true },
        ]);
      if (repoResult.topics.length) repoEmbed.addFields([{ name: 'Topics', value: `${repoResult.topics.join(', ')}` }]);
      if (repoResult.license) repoEmbed.addFields([{ name: 'License', value: `[${repoResult.license.name}](${repoResult.license.url})` }]);

      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setLabel(`${repoResult.stargazers_count} stars`)
            .setStyle(ButtonStyle.Link)
            .setURL(repoResult.html_url + '/stargazers'),
          new ButtonBuilder()
            .setLabel(`${repoResult.forks_count} forks`)
            .setStyle(ButtonStyle.Link)
            .setURL(repoResult.html_url + '/network/members'),
          new ButtonBuilder()
            .setLabel(`${repoResult.open_issues_count} issues`)
            .setStyle(ButtonStyle.Link)
            .setURL(repoResult.html_url + '/issues'),
          new ButtonBuilder()
            .setLabel(`${repoResult.watchers_count} watching`)
            .setStyle(ButtonStyle.Link)
            .setURL(repoResult.html_url + '/watchers'),
          new ButtonBuilder()
            .setLabel(`${!repoResult.has_downloads ? 'No ' : ''}Releases`)
            .setStyle(ButtonStyle.Link)
            .setURL(repoResult.html_url + '/releases'),
        ]);

      // send the embed
      await interaction.reply({ embeds: [repoEmbed], components: [row] });
    }
    catch (err) { error(err, interaction); }
  },
};