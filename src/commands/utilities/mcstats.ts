import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createPaste } from 'hastebin';
import protocols from '../../misc/mcprotocol.json';
import { refresh } from '../../misc/emoji.json';
import { SlashCommand } from 'types/Objects';
import stats from '../../options/stats';

export const mcstats: SlashCommand = {
  description: 'Get the status of a Minecraft server',
  aliases: ['mcstatus'],
  usage: '<Server IP>',
  options: stats,
  async execute(message, args) {
    try {
      const StatsEmbed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setImage(`https://api.loohpjames.com/serverbanner.png?ip=${args[0]};width=918`);
      const json = await fetch(`https://api.mcsrvstat.us/2/${args[0]}`);
      const pong = await json.json();
      if (!pong.online) {
        error('Invalid Server IP / Server is offline', message, true);
        return;
      }
      if (pong.hostname) StatsEmbed.setTitle(pong.hostname);
      else if (pong.port == 25565) StatsEmbed.setTitle(pong.ip);
      else StatsEmbed.setTitle(`${pong.ip}:${pong.port}`);
      if (pong.debug.cachetime) StatsEmbed.setDescription(`Last Pinged: <t:${pong.debug.cachetime}:R>`);
      else StatsEmbed.setDescription(`Last Pinged: <t:${Math.round(Date.now() / 1000)}:R>`);
      if (pong.version) StatsEmbed.addFields([{ name: '**Version:**', value: pong.version, inline: true }]);
      if (pong.protocol != -1 && pong.protocol) StatsEmbed.addFields([{ name: '**Protocol:**', value: `${pong.protocol} (${protocols[pong.protocol as keyof typeof protocols]})`, inline: true }]);
      if (pong.software) StatsEmbed.addFields([{ name: '**Software:**', value: pong.software, inline: true }]);
      if (pong.players) StatsEmbed.addFields([{ name: '**Players Online:**', value: `${pong.players.online} / ${pong.players.max}`, inline: true }]);
      if (pong.players && pong.players.list && pong.players.online > 50) {
        const link = await createPaste(pong.players.list.join('\n'), { server: 'https://bin.birdflop.com' });
        StatsEmbed.addFields([{ name: '**Players:**', value: `[Click Here](${link})`, inline: true }]);
      }
      else if (pong.players && pong.players.list) {
        StatsEmbed.addFields([{ name: '**Players:**', value: pong.players.list.join('\n').replace(/_/g, '\\_') }]);
      }
      if (pong.motd) StatsEmbed.addFields([{ name: '**MOTD:**', value: pong.motd.clean.join('\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&le;/g, '≤').replace(/&ge;/g, '≥') }]);
      if (pong.plugins && pong.plugins.raw.length) {
        const link = await createPaste(pong.plugins.raw.join('\n'), { server: 'https://bin.birdflop.com' });
        StatsEmbed.addFields([{ name: '**Plugins:**', value: `[Click Here](${link})`, inline: true }]);
      }
      if (!pong.debug.query) StatsEmbed.setFooter({ text: 'Query disabled! If you want more info, contact the owner to enable query.' });
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
          .setCustomId('stats_refresh')
          .setLabel('Refresh')
          .setEmoji({ id: refresh })
          .setStyle(ButtonStyle.Secondary),
      ]);
      message.reply({ embeds: [StatsEmbed], components: [row] });
    }
    catch (err) { error(err, message); }
  },
};