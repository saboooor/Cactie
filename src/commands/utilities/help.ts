import { ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, ContainerBuilder, MessageFlags, StringSelectMenuInteraction, ComponentType, TextDisplayBuilder } from 'discord.js';
import { Command } from '~/types/Objects';
import commands from '~/lists/cmds';
import * as helpDict from '~/misc/helpdict';

export const help: Command = {
  description: 'Get help with Sova',
  cooldown: 10,
  async execute(interaction, client) {
    try {
      const HelpContainer = new ContainerBuilder()
        .addSectionComponents(section => section
          .addTextDisplayComponents(text => text
            .setContent(`# ${client.user.username} Help Menu\nUse the dropdown below to select a category to view commands in that category!`),
          )
          .setThumbnailAccessory(thumb => thumb
            .setURL(client.user.displayAvatarURL()),
          ),
        )
        .addSeparatorComponents(separator => separator)
        .addTextDisplayComponents(text => text
          .setContent('-# No category selected'),
        );

      const options: StringSelectMenuOptionBuilder[] = [];
      const categories = Object.keys(helpDict);
      categories.forEach(category => {
        if (category == 'supportpanel') return;
        options.push(
          new StringSelectMenuOptionBuilder()
            .setLabel(helpDict[category as keyof typeof helpDict].name)
            .setDescription(helpDict[category as keyof typeof helpDict].description)
            .setValue(category),
        );
      });

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents([
          new StringSelectMenuBuilder()
            .setCustomId('help_menu')
            .setPlaceholder('Select a help category!')
            .addOptions(options),
        ]);
      const row2 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setURL('https://sova.fyi/discord')
            .setLabel('Support Discord')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setURL('https://paypal.me/youhavebeenyoted')
            .setLabel('Donate')
            .setStyle(ButtonStyle.Link),
        ]);

      HelpContainer.addActionRowComponents(row).addActionRowComponents(row2);
      const helpMsg = await interaction.reply({ components: [HelpContainer], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] });

      const filter = (i: StringSelectMenuInteraction) => i.customId == 'help_menu';
      const collector = helpMsg.createMessageComponentCollector<ComponentType.StringSelect>({ filter, time: 3600000 });
      collector.on('collect', async (selint: StringSelectMenuInteraction) => {
        await selint.deferUpdate();

        const subcmd = selint.values[0];
        console.log(subcmd);
        const category = helpDict[subcmd as keyof typeof helpDict];
        if (!category) {
          error('Invalid help category', interaction);
          return;
        }

        // filter the commands list to only commands in that category and create an array of their names and descriptions
        const commandList = commands.filter(c => c.category == subcmd);
        const array: string[] = commandList.map(c => {
          return `**${c.name}**${c.description ? `\n${c.description}` : ''}${c.permission ? `\n-# *Permission: ${c.permission}*` : ''}`;
        });
        HelpContainer.spliceComponents(2, 1, new TextDisplayBuilder()
          .setContent(`**${category.name.toUpperCase()}**\n${category.description}\n-# [] = Optional\n-# <> = Required\n\n${array.join('\n')}`),
        );

        selint.editReply({ components: [HelpContainer], flags: [MessageFlags.IsComponentsV2] });
      });

      collector.on('end', () => {
        HelpContainer.addTextDisplayComponents(text => text
          .setContent('Help command timed out.'),
        );
        interaction.editReply({ components: [HelpContainer], flags: [MessageFlags.IsComponentsV2] }).catch(err => logger.warn(err));
      });
    }
    catch (err) { error(err, interaction); }
  },
};
