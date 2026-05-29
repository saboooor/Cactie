import { ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags } from 'discord.js';
import { Command } from '~/types/Objects';
import githubOptions from '~/options/github';

function truncateString(str: string, num: number) {
  if (str.length <= num) return str; return str.slice(0, num - 1) + '…';
}

export const github: Command = {
  description: 'Get info on any GitHub repository',
  options: githubOptions,
  async autoComplete(_, interaction) {
    const value = interaction.options.getFocused();
    if (!value) return interaction.respond([{ name: 'Invalid Query', value: 'saboooor/Sova' }]);

    // query the github api for repo names matching the input
    const query = await fetch(
      `https://api.github.com/search/repositories?q=${value}&per_page=25`,
      { headers: { 'Accept': 'application/json' } },
    );
    const searchResult = await query.json() as any;

    // if there are no results, respond with that, otherwise respond with the repo names
    if (!searchResult.items) return interaction.respond([{ name: value, value }]);
    if (!searchResult.items.length) return interaction.respond([{ name: 'No repos found', value }]);

    // truncate the repo names to 100 characters and respond with them
    const results = searchResult.items.map((item: { full_name: string }) => {
      return { name: truncateString(item.full_name, 100), value: item.full_name };
    });
    interaction.respond(results);
  },
  async execute(interaction) {
    try {
      // fetch the github repo
      const repo = interaction.options.getString('repo', true);
      const repoFetch = await fetch(`https://api.github.com/repos/${repo}`, { headers: { 'Accept': 'application/json' } });
      const repoResult = await repoFetch.json() as any;
      console.log(repoResult);

      const repoContainer = new ContainerBuilder()
        .addSectionComponents(section => section
          .addTextDisplayComponents(
            text => text
              .setContent(`# [${repoResult.full_name}](${repoResult.html_url})${
                repoResult.parent ? `\n-# forked from [${repoResult.parent.full_name}](${repoResult.parent.html_url})` : ''
              }${
                repoResult.description ? `\n${repoResult.description}` : ''
              }`),
            text => text
              .setContent(`**Created:** <t:${Math.round(new Date(repoResult.created_at).getTime() / 1000)}>\n**Updated:** <t:${Math.round(new Date(repoResult.pushed_at).getTime() / 1000)}>`),
          )
          .setThumbnailAccessory(thumb => thumb
            .setURL(repoResult.owner.avatar_url ?? ''),
          ),
        )
        .addActionRowComponents(button => button
          .addComponents(
            new ButtonBuilder()
              .setLabel(`${repoResult.stargazers_count} stars`)
              .setEmoji({ name: '⭐' })
              .setStyle(ButtonStyle.Link)
              .setURL(repoResult.stargazers_url),
            new ButtonBuilder()
              .setLabel(`${repoResult.forks_count} forks`)
              .setEmoji({ name: '🍴' })
              .setStyle(ButtonStyle.Link)
              .setURL(repoResult.forks_url),
            new ButtonBuilder()
              .setLabel(`${repoResult.open_issues_count} issues`)
              .setEmoji({ name: '❗' })
              .setStyle(ButtonStyle.Link)
              .setURL(`${repoResult.html_url}/issues`),
            new ButtonBuilder()
              .setLabel(`${repoResult.watchers_count} watchers`)
              .setEmoji({ name: '👀' })
              .setStyle(ButtonStyle.Link)
              .setURL(`${repoResult.html_url}/watchers`),
          ),
        )
        .addSeparatorComponents(separator => separator);

      if (repoResult.language) repoContainer
        .addTextDisplayComponents(text => text
          .setContent(`**Language:** ${repoResult.language}`),
        );
      if (repoResult.size) repoContainer
        .addTextDisplayComponents(text => text
          .setContent(`**Size:** ${repoResult.size / 1000} MB`),
        );
      if (repoResult.license) repoContainer
        .addTextDisplayComponents(text => text
          .setContent(`**License:** [${repoResult.license.name}](${repoResult.license.url})`),
        );
      if (repoResult.topics.length) repoContainer
        .addTextDisplayComponents(text => text
          .setContent(`-# ${repoResult.topics.join(', ')}`),
        );

      // send the embed
      await interaction.reply({ components: [repoContainer], flags: MessageFlags.IsComponentsV2 });
    }
    catch (err) { error(err, interaction); }
  },
};