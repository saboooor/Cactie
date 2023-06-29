import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
import minecraft from '~/options/minecraft';

export const serverjar: SlashCommand = {
  description: 'Get info on any Purpur, Paper, Waterfall, or Velocity build',
  options: minecraft,
  async execute(message, args) {
    try {
      const JarEmbed = new EmbedBuilder().setColor(0x2f3136);
      args[0] = args[0].toLowerCase();
      const row = new ActionRowBuilder<ButtonBuilder>();
      if (args[0] == 'paper' || args[0] == 'waterfall' || args[0] == 'velocity') {
        // fetch the latest mc version
        const a = await fetch(`https://papermc.io/api/v2/projects/${args[0]}`);
        const b = await a.json();
        // if specified args are valid then replace latest with that number
        const c = args[1] ? args[1] : b.versions[b.versions.length - 1];
        // fetch the latest build for mc version specified or latest
        const d = await fetch(`https://papermc.io/api/v2/projects/${args[0]}/versions/${c}`);
        const e = await d.json();
        // check if error
        if (e.error) {
          error(e.error, message, true);
          return;
        }
        const build = e.builds[e.builds.length - 1];
        // fetch the build specified
        const f = args[2] ? args[2] : build;
        const g = await fetch(`https://papermc.io/api/v2/projects/${args[0]}/versions/${c}/builds/${f}`);
        const h = await g.json();
        // check if error
        if (h.error) {
          error(h.error, message, true);
          return;
        }
        // initial embed creation
        JarEmbed.setURL(`https://papermc.io/api/v2/projects/${args[0]}/versions/${c}/builds/${f}`)
          .setTitle(`${args[0]} ${h.version} build ${h.build}`)
          .setDescription(`${h.changes.length} commit(s)`)
          .setTimestamp(Date.parse(h.time));
        // add fields for commits
        h.changes.forEach((commit: { commit: string, message: string }) => {
          // check if commit description is more than 1000, if so, split it into multiple fields
          if (commit.message.length > 1000) commit.message.match(/[\s\S]{1,1000}/g)?.forEach(chunk => { JarEmbed.addFields([{ name: commit.commit, value: `${chunk}` }]); });
          else JarEmbed.addFields([{ name: commit.commit, value: commit.message }]);
        });
        // add button for download
        row.addComponents([
          new ButtonBuilder()
            .setLabel(`Download ${h.downloads.application.name}`)
            .setURL(`https://papermc.io/api/v2/projects/${args[0]}/versions/${c}/builds/${f}/downloads/${h.downloads.application.name}`)
            .setStyle(ButtonStyle.Link),
        ]);
      }
      else if (args[0] == 'purpur') {
        // fetch the latest mc version
        const a = await fetch('https://api.purpurmc.org/v2/purpur');
        const b = await a.json();
        // if specified args are valid then replace latest with that number
        const c = args[1] ? args[1] : b.versions[b.versions.length - 1];
        const d = await fetch(`https://api.purpurmc.org/v2/purpur/${c}`);
        const e = await d.json();
        // check if error
        if (e.error) {
          error(e.error, message, true);
          return;
        }
        // fetch the latest build for mc / build versions specified or latest
        const f = args[2] ? args[2] : 'latest';
        const g = await fetch(`https://api.purpurmc.org/v2/purpur/${c}/${f}`);
        const h = await g.json();
        // check if error
        if (h.error) {
          error(h.error, message, true);
          return;
        }
        // initial embed creation
        JarEmbed.setTitle(`Purpur ${h.version} build ${h.build} (${h.result})`)
          .setURL(`https://api.purpurmc.org/v2/purpur/${c}/${f}`)
          .setThumbnail('https://cdn.discordapp.com/attachments/742476351012864162/865391752675065896/purpur.png')
          .setDescription(`${h.commits.length} commit(s)`)
          .setTimestamp(h.timestamp);
        // add fields for commits
        h.commits.forEach((commit: { author: string, description: string, timestamp: number }) => {
          // check if commit description is more than 1000, if so, split it into multiple fields
          if (commit.description.length > 1000) commit.description.match(/[\s\S]{1,1000}/g)?.forEach(chunk => { JarEmbed.addFields([{ name: commit.author, value: `${chunk}` }]); });
          else JarEmbed.addFields([{ name: commit.author, value: `${commit.description}\n*<t:${commit.timestamp / 1000}>\n<t:${commit.timestamp / 1000}:R>` }]);
        });
        // add button for download
        row.addComponents([
          new ButtonBuilder()
            .setLabel(`Download Purpur ${h.version} build ${h.build} JAR`)
            .setURL(`https://api.purpurmc.org/v2/purpur/${c}/${f}/download`)
            .setStyle(ButtonStyle.Link),
        ]);
      }
      else if (args[0] == 'petal') {
        // fetch the latest mc version
        const a = await fetch('https://api.github.com/repos/Bloom-host/Petal/releases', { headers: { 'Accept': 'application/json' } });
        const b = await a.json();
        const latestRelease = b[0];

        // initial embed creation
        JarEmbed.setTitle(`Petal ${latestRelease.name}`)
          .setAuthor({ name: latestRelease.author.login, iconURL: latestRelease.author.avatar_url, url: latestRelease.author.url })
          .setURL('https://api.github.com/repos/Bloom-host/Petal')
          .setThumbnail('https://camo.githubusercontent.com/946524e97acb9c90a2741c35fccc82410b3a8500886d2e64c44abe94ecf40990/68747470733a2f2f626c6f6f6d2e686f73742f6173736574732f696d616765732f706574616c2d6c6f676f2e706e67')
          .setTimestamp(new Date(latestRelease.published_at))
          .setFooter({ text: `Branch: ${latestRelease.target_commitish}` });

        // add fields for extra info
        if (latestRelease.prerelease) JarEmbed.addFields([{ name: 'Notice', value: 'This is a pre-release' }]);
        if (latestRelease.assets[0].download_count) JarEmbed.addFields({ name: 'Downloads', value: `${latestRelease.assets[0].download_count}` });
        if (latestRelease.body) JarEmbed.setDescription(latestRelease.body);

        // add button for download
        row.addComponents([
          new ButtonBuilder()
            .setLabel(`Download ${latestRelease.assets[0].name} (${latestRelease.assets[0].size / 1000000} MB)`)
            .setURL(latestRelease.assets[0].browser_download_url)
            .setStyle(ButtonStyle.Link),
        ]);
      }
      else {
        error('Invalid Minecraft server fork.', message, true);
        return;
      }
      // send embed
      message.reply({ embeds: [JarEmbed], components: [row] });
    }
    catch (err) { error(err, message); }
  },
};