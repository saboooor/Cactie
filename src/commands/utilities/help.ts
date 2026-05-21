import { ButtonBuilder, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, StringSelectMenuInteraction, ComponentType } from 'discord.js';
import { Command } from '~/types/Objects';
import commands from '~/lists/cmds';
import helpOptions from '~/options/help';
import * as helpdesc from '~/misc/helpdesc';

export const help: Command = {
  description: 'Get help with Sova',
  cooldown: 10,
  options: helpOptions,
  async execute(interaction) {
    try {
      let HelpEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('**HELP**');
      const subcmd = interaction.options.getSubcommand();

      if (subcmd == 'admin' || subcmd == 'fun' || subcmd == 'animals' || subcmd == 'tickets' || subcmd == 'utilities' || subcmd == 'actions') {
        const category = helpdesc[subcmd as keyof typeof helpdesc];
        const commandList = commands.filter(c => c.category == subcmd);
        const array: string[] = [];
        commandList.forEach(c => { array.push(`**${c.name}**${c.description ? `\n${c.description}` : ''}${c.permission ? `\n*Permission: ${c.permission}*` : ''}`); });
        HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
        if (category.footer) HelpEmbed.setFooter({ text: category.footer });
        if (category.field) HelpEmbed.setFields([category.field]);
      }
      else {
        HelpEmbed.setDescription('Please use the dropdown below to navigate through the help menu\n\n**Options:**\nAdmin, Fun, Animals, Tickets, Utilities, Actions');
      }
      const options: StringSelectMenuOptionBuilder[] = [];
      const categories = Object.keys(helpdesc);
      categories.forEach(category => {
        if (category == 'supportpanel') return;
        options.push(
          new StringSelectMenuOptionBuilder()
            .setLabel(helpdesc[category as keyof typeof helpdesc].name)
            .setDescription(helpdesc[category as keyof typeof helpdesc].description)
            .setValue(`help_${category}`)
            .setDefault(subcmd == category),
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
            .setURL('https://luminescent.dev/discord')
            .setLabel('Support Discord')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setURL('https://paypal.me/youhavebeenyoted')
            .setLabel('Donate')
            .setStyle(ButtonStyle.Link),
        ]);
      const helpMsg = await interaction.reply({ embeds: [HelpEmbed], components: [row, row2] });

      const filter = (i: StringSelectMenuInteraction) => i.customId == 'help_menu';
      const collector = helpMsg.createMessageComponentCollector<ComponentType.StringSelect>({ filter, time: 3600000 });
      collector.on('collect', async (selint: StringSelectMenuInteraction) => {
        await selint.deferUpdate();
        HelpEmbed = new EmbedBuilder()
          .setColor('Random')
          .setTitle('**HELP**');
        const category = helpdesc[selint.values[0].split('_')[1] as keyof typeof helpdesc];
        const commandList = commands.filter(c => c.category == selint.values[0].split('_')[1]);
        const array: string[] = [];
        commandList.forEach(c => { array.push(`**${c.name}**${c.description ? `\n${c.description}` : ''}${c.permission ? `\nPermission: ${c.permission}` : ''}`); });
        HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
        if (category.footer) HelpEmbed.setFooter({ text: category.footer });
        if (category.field) HelpEmbed.setFields([category.field]);
        row.components[0].options.forEach(option => option.setDefault(option.toJSON().value == selint.values[0]));
        selint.editReply({ embeds: [HelpEmbed], components: [row, row2] });
      });

      collector.on('end', () => {
        HelpEmbed.setDescription('Help command timed out.')
          .setFooter({ text: 'please do the help command again if you still need a list of commands.' });
        interaction.editReply({ embeds: [HelpEmbed], components: [row2] }).catch(err => logger.warn(err));
      });
    }
    catch (err) { error(err, interaction); }
  },
};
