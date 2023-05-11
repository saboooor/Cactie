function capFirstLetter(string: string) { return string.charAt(0).toUpperCase() + string.slice(1); }
import { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ButtonInteraction, ComponentType, CommandInteraction } from 'discord.js';
import { left, right } from '~/misc/emoji.json';
import { SlashCommand } from '~/types/Objects';
import desc from '~/misc/settingsdesc.json';
import { PrismaClient } from '@prisma/client';

export const settings: SlashCommand = {
  description: 'Configure this server\' Cactie settings',
  aliases: ['setting', 'dashboard'],
  ephemeral: true,
  async execute(message, args, client) {
    try {
      // Create Embed with title and color
      const SettingsEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Bot Settings');

      // Get settings and make an array out of it to split and make pages
      // Get server config
      const prisma = new PrismaClient();
      const srvconfig = await prisma.settings.findUnique({ where: { guildId: message.guild!.id } });
      if (!srvconfig) {
        error('Server config not found.', message);
        return;
      }
      let configlist = Object.keys(srvconfig).slice(0, 5).map(prop => { return `**${capFirstLetter(prop)}**\n${desc[prop as keyof typeof desc]}\n\`${srvconfig[prop as keyof typeof desc]}\``; });
      const maxPages = Math.ceil(Object.keys(srvconfig).length / 5);

      // Set embed description with page and stuff
      SettingsEmbed.setDescription(configlist.join('\n'))
        .addFields([{ name: 'How do I change these values?', value: 'Click the dashboard button below!' }])
        .setFooter({ text: `Page 1 of ${maxPages}` });

      // Add buttons for page changing
      const pages = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setCustomId('page_prev')
            .setEmoji({ id: left })
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('page_next')
            .setEmoji({ id: right })
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setURL(`https://cactie.luminescent.dev/dashboard/${client.user!.username.split(' ')[1] == 'Dev' ? 'dev' : 'master'}/${message.guild!.id}`)
            .setLabel('Dashboard')
            .setStyle(ButtonStyle.Link),
        ]);

      const SettingsMsg = await message.reply({ embeds: [SettingsEmbed], components: [pages] });
      const filter = (i: ButtonInteraction) => i.customId.startsWith('page_');
      const collector = SettingsMsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 120000 });
      collector.on('collect', async interaction => {
        // Defer interaction
        await interaction.deferUpdate();
        let page = SettingsEmbed.toJSON().footer ? Number(SettingsEmbed.toJSON().footer!.text.split(' ')[1]) : maxPages;
        if (interaction.customId == 'page_prev') page = page - 1 ? page - 1 : maxPages;
        else if (interaction.customId == 'page_next') page = page + 1 == maxPages + 1 ? 1 : page + 1;
        const end = page * 5;
        const start = end - 5;

        configlist = Object.keys(srvconfig).slice(start, end).map(prop => { return `**${capFirstLetter(prop)}**\n${desc[prop as keyof typeof desc]}\n\`${srvconfig[prop as keyof typeof desc]}\``; });

        // Update embed description with new page and reply
        SettingsEmbed.setDescription(configlist.join('\n'))
          .setFooter({ text: `Page ${page} of ${maxPages}` });
        await interaction.editReply({ embeds: [SettingsEmbed] });
      });

      // When the collector stops, delete the message
      collector.on('end', async () => {
        try {
          if (message instanceof CommandInteraction) {
            await message.editReply({ components: [] });
            return;
          }
          await SettingsMsg.delete();
          await message.delete();
        }
        catch (err) {
          logger.warn(err);
        }
      });
    }
    catch (err) { error(err, message); }
  },
};