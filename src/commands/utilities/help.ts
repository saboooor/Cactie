import { ButtonBuilder, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, GuildMember, CategoryChannel, StringSelectMenuInteraction, ComponentType, CommandInteraction } from 'discord.js';
import checkPerms, { PermissionChannel } from '../../functions/checkPerms';
import { SlashCommand } from 'types/Objects';
import commands from '../../lists/commands';
import helpOptions from '../../options/help';
import * as helpdesc from '../../misc/helpdesc';

export const help: SlashCommand = {
  description: 'Get help with Cactie',
  aliases: ['commands'],
  usage: '[Type]',
  cooldown: 10,
  options: helpOptions,
  async execute(message, args) {
    try {
      const srvconfig = await sql.getData('settings', { guildId: message.guild!.id });
      let HelpEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('**HELP**');
      let arg = args[0];
      if (arg) arg = arg.toLowerCase();

      if (arg == 'admin' || arg == 'fun' || arg == 'animals' || arg == 'tickets' || arg == 'utilities' || arg == 'actions') {
        const category = helpdesc[arg.toLowerCase() as keyof typeof helpdesc];
        const commandList = commands.filter(c => c.category == arg.toLowerCase());
        const array: string[] = [];
        commandList.forEach(c => { array.push(`**${c.name}${c.usage ? ` ${c.usage}` : ''}**${c.voteOnly ? ' <:vote:973735241619484723>' : ''}${c.description ? `\n${c.description}` : ''}${c.aliases ? `\n*Aliases: ${c.aliases.join(', ')}*` : ''}${c.permissions ? `\n*Permissions: ${c.permissions.join(', ')}*` : ''}`); });
        HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
        if (category.footer) HelpEmbed.setFooter({ text: category.footer });
        if (category.field) HelpEmbed.setFields([category.field]);
      }
      else if (arg == 'supportpanel') {
        const permCheck = checkPerms(['Administrator'], message.member as GuildMember);
        if (permCheck) {
          error(permCheck, message, true);
          return;
        }
        const Panel = new EmbedBuilder()
          .setColor(0x2f3136)
          .setTitle('Need help? No problem!')
          .setFooter({ text: `${message.guild!.name} Support`, iconURL: message.guild!.iconURL() ?? undefined });
        let channel;
        if (args[1]) channel = message.guild!.channels.cache.get(args[1]) as Exclude<PermissionChannel, CategoryChannel>;
        if (!channel) channel = message.channel as Exclude<PermissionChannel, CategoryChannel>;
        const permCheck2 = checkPerms(['SendMessages', 'ReadMessageHistory'], message.guild!.members.me!, channel);
        if (permCheck2) {
          error(permCheck2, message, true);
          return;
        }

        if (srvconfig.tickets == 'buttons') {
          Panel.setDescription('Click the button below to open a ticket!');
          const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
              new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('Open Ticket')
                .setEmoji({ name: '🎫' })
                .setStyle(ButtonStyle.Primary),
            ]);
          await channel.send({ embeds: [Panel], components: [row] });
          message.reply({ content: 'Support panel created! You may now delete this message' });
          return;
        }
        else if (srvconfig.tickets == 'reactions') {
          Panel.setDescription('React with 🎫 to open a ticket!');
          const panelMsg = await channel.send({ embeds: [Panel] });
          await panelMsg.react('🎫');
        }
        else if (srvconfig.tickets == 'false') {
          error('Tickets are disabled!', message, true);
          return;
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
      const helpMsg = await message.reply({ embeds: [HelpEmbed], components: [row, row2] });

      const filter = (i: StringSelectMenuInteraction) => i.customId == 'help_menu';
      const collector = helpMsg.createMessageComponentCollector<ComponentType.StringSelect>({ filter, time: 3600000 });
      collector.on('collect', async (interaction: StringSelectMenuInteraction) => {
        await interaction.deferUpdate();
        HelpEmbed = new EmbedBuilder()
          .setColor('Random')
          .setTitle('**HELP**');
        const category = helpdesc[interaction.values[0].split('_')[1] as keyof typeof helpdesc];
        const commandList = commands.filter(c => c.category == interaction.values[0].split('_')[1]);
        const array: string[] = [];
        commandList.forEach(c => { array.push(`**${c.name}${c.usage ? ` ${c.usage}` : ''}**${c.voteOnly ? ' <:vote:973735241619484723>' : ''}${c.description ? `\n${c.description}` : ''}${c.aliases ? `\n*Aliases: ${c.aliases.join(', ')}*` : ''}${c.permissions ? `\nPermissions: ${c.permissions.join(', ')}` : ''}`); });
        HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
        if (category.footer) HelpEmbed.setFooter({ text: category.footer });
        if (category.field) HelpEmbed.setFields([category.field]);
        row.components[0].options.forEach(option => option.setDefault(option.toJSON().value == interaction.values[0]));
        interaction.editReply({ embeds: [HelpEmbed], components: [row, row2] });
      });

      collector.on('end', () => {
        HelpEmbed.setDescription('Help command timed out.')
          .setFooter({ text: 'please do the help command again if you still need a list of commands.' });
        if (message instanceof CommandInteraction) message.editReply({ embeds: [HelpEmbed], components: [row2] }).catch(err => logger.warn(err));
        else helpMsg.edit({ embeds: [HelpEmbed], components: [row2] }).catch(err => logger.warn(err));
      });
    }
    catch (err) { error(err, message); }
  },
};
