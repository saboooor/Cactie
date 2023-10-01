import { ButtonBuilder, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, StringSelectMenuInteraction, ComponentType, BaseGuildTextChannel } from 'discord.js';
import checkPerms from '~/functions/checkPerms';
import { SlashCommand } from '~/types/Objects';
import commands from '~/lists/cmds';
import helpOptions from '~/options/help';
import * as helpdesc from '~/misc/helpdesc';
import { getGuildConfig } from '~/functions/prisma';

export const help: SlashCommand = {
  description: 'Get help with Cactie',
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
      else if (subcmd == 'supportpanel') {
        if (!interaction.inCachedGuild()) {
          error('This command can only be used in servers!', interaction, true);
          return;
        }
        // Get server config
        const srvconfig = await getGuildConfig(interaction.guild.id);
        const permCheck = checkPerms(['Administrator'], interaction.member);
        if (permCheck) {
          error(permCheck, interaction, true);
          return;
        }
        let channel = interaction.options.getChannel('channel');
        if (!channel || !(channel instanceof BaseGuildTextChannel)) channel = interaction.channel!;
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const footer = interaction.options.getString('footer');

        const Panel = new EmbedBuilder()
          .setColor(0x2f3136)
          .setTitle(title ?? 'Need help? No problem!')
          .setFooter({ text: footer ?? `${interaction.guild.name} Support`, iconURL: interaction.guild.iconURL() ?? undefined });
        const permCheck2 = checkPerms(['SendMessages', 'ReadMessageHistory'], interaction.guild.members.me!, channel);
        if (permCheck2) {
          error(permCheck2, interaction, true);
          return;
        }

        if (!srvconfig.tickets.enabled) {
          error('Tickets are disabled!', interaction, true);
          return;
        }

        if (srvconfig.tickets.type == 'buttons') {
          Panel.setDescription(description ?? 'Click the button below to open a ticket!');
          const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
              new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('Open Ticket')
                .setEmoji({ name: '🎫' })
                .setStyle(ButtonStyle.Primary),
            ]);
          await channel.send({ embeds: [Panel], components: [row] });
          interaction.reply({ content: 'Support panel created! You may now delete this message' });
          return;
        }
        else if (srvconfig.tickets.type == 'reactions') {
          Panel.setDescription(description ?? 'React with 🎫 to open a ticket!');
          const panelMsg = await channel.send({ embeds: [Panel] });
          await panelMsg.react('🎫');
        }
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
