import analyzeTimings from '~/functions/timings/analyzeTimings';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, ComponentType } from 'discord.js';
import { left, right } from '~/misc/emoji.json';
import { SlashCommand } from '~/types/Objects';
import url from '~/options/url';
const buttons = new ActionRowBuilder<ButtonBuilder>()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('analysis_prev')
      .setEmoji({ id: left })
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('analysis_next')
      .setEmoji({ id: right })
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setURL('https://github.com/pemigrade/botflop')
      .setLabel('Botflop')
      .setStyle(ButtonStyle.Link),
  ]);

export const timings: SlashCommand = {
  description: 'Analyze Paper timings to help optimize your server.',
  cooldown: 10,
  options: url,
  async execute(interaction) {
    try {
      let id;

      let AnalysisEmbed = new EmbedBuilder()
        .setDescription('These are not magic values. Many of these settings have real consequences on your server\'s mechanics. See [this guide](https://eternity.community/index.php/paper-optimization/) for detailed information on the functionality of each setting.')
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() ?? undefined });

      const urlArg = interaction.options.getString('url', true);
      if (urlArg.startsWith('https://spark.lucko.me')) {
        AnalysisEmbed.addFields([{ name: '⚠️ Spark Profile', value: 'This is a Spark Profile. Use /profile instead for this type of report.' }]);
      }
      if (urlArg.startsWith('https://www.spigotmc.org/go/timings?url=') || urlArg.startsWith('https://spigotmc.org/go/timings?url=')) {
        AnalysisEmbed.addFields([{ name: '❌ Spigot', value: 'Spigot timings have limited information. Switch to [Purpur](https://purpurmc.org) for better timings analysis. All your plugins will be compatible, and if you don\'t like it, you can easily switch back.' }]);
      }
      if (urlArg.startsWith('https://timin') && urlArg.includes('?id=')) id = urlArg.replace('/d=', '/?id=').split('#')[0].split('\n')[0].split('?id=')[1];

      if (!id) {
        AnalysisEmbed.addFields([{ name: '❌ Invalid Timings URL', value: 'Please provide a valid timings link.' }]);
        interaction.reply({ embeds: [AnalysisEmbed] });
        return;
      }

      let fields = (await analyzeTimings(id)).map(field => { return { ...field, inline: true }; });

      const suggestions = [...fields];
      let components = [];
      if (suggestions.length >= 13) {
        fields.splice(12, suggestions.length, { name: `Plus ${suggestions.length - 12} more recommendations`, value: 'Click the buttons below to see more', inline: false });
        AnalysisEmbed.setFooter({ text: `Requested by ${interaction.user.username} • Page 1 of ${Math.ceil(suggestions.length / 12)}`, iconURL: interaction.user.avatarURL() ?? undefined });
        components.push(buttons);
      }

      AnalysisEmbed.setAuthor({ name: 'Timings Analysis', url: `https://timings.aikar.co/?id=${id}` })
        .setFields(fields);

      const timingsmsg = await interaction.reply({ embeds: [AnalysisEmbed], components });

      if (suggestions.length < 13) return;
      const filter = (i: ButtonInteraction) => i.user.id == interaction.user.id && i.customId.startsWith('analysis_');
      const collector = timingsmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 300000 });
      collector.on('collect', async (i: ButtonInteraction) => {
        // Defer button
        await i.deferUpdate();

        // Get the embed
        AnalysisEmbed = new EmbedBuilder(i.message.embeds[0].toJSON());
        const footer = AnalysisEmbed.toJSON().footer!;

        // Force analysis button
        if (i.customId == 'analysis_force') {
          fields = [...suggestions];
          components = [];
          if (suggestions.length >= 13) {
            fields.splice(12, suggestions.length, { name: `**Plus ${suggestions.length - 12} more recommendations**`, value: 'Click the buttons below to see more', inline: false });
            components.push(buttons);
          }
          AnalysisEmbed.setFields(fields);

          // Send the embed
          i.editReply({ embeds: [AnalysisEmbed], components });
          return;
        }

        // Calculate total amount of pages and get current page from embed footer
        const text = footer.text.split(' • ');
        const lastPage = parseInt(text[text.length - 1].split('Page ')[1].split(' ')[0]);
        const maxPages = parseInt(text[text.length - 1].split('Page ')[1].split(' ')[2]);

        // Get next page (if last page, go to pg 1)
        const page = i.customId == 'analysis_next' ? lastPage == maxPages ? 1 : lastPage + 1 : lastPage - 1 ? lastPage - 1 : maxPages;
        const end = page * 12;
        const start = end - 12;
        fields = suggestions.slice(start, end);

        // Update the embed
        text[text.length - 1] = `Page ${page} of ${Math.ceil(suggestions.length / 12)}`;
        AnalysisEmbed
          .setFields(fields)
          .setFooter({ iconURL: footer.icon_url, text: text.join(' • ') });

        // Send the embed
        i.editReply({ embeds: [AnalysisEmbed] });
      });

      // When the collector stops, remove all buttons from it
      collector.on('end', () => {
        interaction.editReply({ components: [] }).catch(err => logger.warn(err));
      });
    }
    catch (err) { error(err, interaction); }
  },
};
