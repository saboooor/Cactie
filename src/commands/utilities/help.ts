import { ButtonBuilder, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, StringSelectMenuInteraction, ComponentType, GuildTextBasedChannel } from 'discord.js';
import checkPerms from '~/functions/checkPerms';
import { SlashCommand } from '~/types/Objects';
import commands from '~/lists/slash';
import helpOptions from '~/options/help';
import * as helpdesc from '~/misc/helpdesc';
import { getGuildConfig } from '~/functions/prisma';

export const help: SlashCommand = {
  description: 'Get help with Cactie',
  cooldown: 10,
  options: helpOptions,
  async execute(interaction, args) {
    try {
      let HelpEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('**HELP**');
      let arg = args[0];
      if (arg) arg = arg.toLowerCase();

      if (arg == 'admin' || arg == 'fun' || arg == 'animals' || arg == 'tickets' || arg == 'utilities' || arg == 'actions') {
        const category = helpdesc[arg.toLowerCase() as keyof typeof helpdesc];
        const commandList = commands.filter(c => c.category == arg.toLowerCase());
        const array: string[] = [];
        commandList.forEach(c => { array.push(`**${c.name}**${c.voteOnly ? ' <:vote:973735241619484723>' : ''}${c.description ? `\n${c.description}` : ''}${c.permissions ? `\n*Permissions: ${c.permissions.join(', ')}*` : ''}`); });
        HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
        if (category.footer) HelpEmbed.setFooter({ text: category.footer });
        if (category.field) HelpEmbed.setFields([category.field]);
      }
      else if (arg == 'supportpanel') {
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
        const Panel = new EmbedBuilder()
          .setColor(0x2f3136)
          .setTitle(args[2] ?? 'Need help? No problem!')
          .setFooter({ text: args[4] ?? `${interaction.guild.name} Support`, iconURL: interaction.guild.iconURL() ?? undefined });
        let channel;
        if (args[1]) channel = interaction.guild.channels.cache.get(args[1]) as GuildTextBasedChannel;
        if (!channel) channel = interaction.channel as GuildTextBasedChannel;
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
          Panel.setDescription(args[3] ?? 'Click the button below to open a ticket!');
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
          Panel.setDescription(args[3] ?? 'React with 🎫 to open a ticket!');
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
            .setDefault(arg == category),
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
        commandList.forEach(c => { array.push(`**${c.name}**${c.voteOnly ? ' <:vote:973735241619484723>' : ''}${c.description ? `\n${c.description}` : ''}${c.permissions ? `\nPermissions: ${c.permissions.join(', ')}` : ''}`); });
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
