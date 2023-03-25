const commands = require('../../lists/commands').default;
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle } = require('discord.js');
const checkPerms = require('../../functions/checkPerms');

module.exports = {
	name: 'help',
	description: 'Get help with Cactie',
	aliases: ['commands'],
	usage: '[Type]',
	cooldown: 10,
	options: require('../../options/help.js'),
	async execute(message, args, client, lang) {
		try {
			const helpdesc = require(`../../lang/${lang.language.name}/helpdesc.json`);
			const srvconfig = await client.getData('settings', { guildId: message.guild.id });
			let HelpEmbed = new EmbedBuilder()
				.setColor('Random')
				.setTitle('**HELP**');
			let arg = args[0];
			if (arg) arg = arg.toLowerCase();

			if (arg == 'admin' || arg == 'fun' || arg == 'animals' || arg == 'tickets' || arg == 'utilities' || arg == 'actions') {
				const category = helpdesc[arg.toLowerCase()];
				const commandList = commands.filter(c => c.category == arg.toLowerCase());
				const array = [];
				commandList.forEach(c => { array.push(`**${c.name}${c.usage ? ` ${c.usage}` : ''}**${c.voteOnly ? ' <:vote:973735241619484723>' : ''}${c.description ? `\n${c.description}` : ''}${c.aliases ? `\n*Aliases: ${c.aliases.join(', ')}*` : ''}${c.permission ? `\n*Permissions: ${c.permissions.join(', ')}*` : ''}`); });
				HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
				if (category.footer) HelpEmbed.setFooter({ text: category.footer });
				if (category.field) HelpEmbed.setFields([category.field]);
			}
			else if (arg == 'supportpanel') {
				const permCheck = checkPerms(['Administrator'], message.member);
				if (permCheck) return client.error(permCheck, message, true);
				const Panel = new EmbedBuilder()
					.setColor(0x2f3136)
					.setTitle('Need help? No problem!')
					.setFooter({ text: `${message.guild.name} Support`, iconURL: message.guild.iconURL() });
				let channel;
				if (args[1]) channel = message.guild.channels.cache.get(args[1]);
				if (!channel) channel = message.channel;
				const permCheck2 = checkPerms(['SendMessages', 'ReadMessageHistory'], message.guild.members.me, channel);
				if (permCheck2) return client.error(permCheck2, message, true);

				if (srvconfig.tickets == 'buttons') {
					Panel.setDescription('Click the button below to open a ticket!');
					const row = new ActionRowBuilder()
						.addComponents([
							new ButtonBuilder()
								.setCustomId('create_ticket')
								.setLabel('Open Ticket')
								.setEmoji({ name: '🎫' })
								.setStyle(ButtonStyle.Primary),
						]);
					await channel.send({ embeds: [Panel], components: [row] });
					return message.reply({ content: 'Support panel created! You may now delete this message' });
				}
				else if (srvconfig.tickets == 'reactions') {
					Panel.setDescription('React with 🎫 to open a ticket!');
					const panelMsg = await channel.send({ embeds: [Panel] });
					await panelMsg.react('🎫');
				}
				else if (srvconfig.tickets == 'false') {
					return client.error('Tickets are disabled!', message, true);
				}
			}
			else {
				HelpEmbed.setDescription('Please use the dropdown below to navigate through the help menu\n\n**Options:**\nAdmin, Fun, Animals, Tickets, Utilities, Actions');
			}
			const options = [];
			const categories = Object.keys(helpdesc);
			categories.forEach(category => {
				if (category == 'supportpanel') return;
				options.push(
					new StringSelectMenuOptionBuilder()
						.setLabel(helpdesc[category].name)
						.setDescription(helpdesc[category].description)
						.setValue(`help_${category}`)
						.setDefault(arg == category),
				);
			});
			const row = new ActionRowBuilder()
				.addComponents([
					new StringSelectMenuBuilder()
						.setCustomId('help_menu')
						.setPlaceholder('Select a help category!')
						.addOptions(options),
				]);
			const row2 = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setURL(`${client.dashboardDomain}/support/discord`)
						.setLabel('Support Discord')
						.setStyle(ButtonStyle.Link),
					new ButtonBuilder()
						.setURL('https://paypal.me/youhavebeenyoted')
						.setLabel('Donate')
						.setStyle(ButtonStyle.Link),
				]);
			const helpMsg = await message.reply({ embeds: [HelpEmbed], components: [row, row2] });

			const filter = i => i.customId == 'help_menu';
			const collector = helpMsg.createMessageComponentCollector({ filter, time: 3600000 });
			collector.on('collect', async interaction => {
				await interaction.deferUpdate();
				HelpEmbed = new EmbedBuilder()
					.setColor('Random')
					.setTitle('**HELP**');
				const category = helpdesc[interaction.values[0].split('_')[1]];
				const commandList = commands.filter(c => c.category == interaction.values[0].split('_')[1]);
				const array = [];
				commandList.forEach(c => { array.push(`**${c.name}${c.usage ? ` ${c.usage}` : ''}**${c.voteOnly ? ' <:vote:973735241619484723>' : ''}${c.description ? `\n${c.description}` : ''}${c.aliases ? `\n*Aliases: ${c.aliases.join(', ')}*` : ''}${c.permission ? `\nPermissions: ${c.permissions.join(', ')}` : ''}`); });
				HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
				if (category.footer) HelpEmbed.setFooter({ text: category.footer });
				if (category.field) HelpEmbed.setFields([category.field]);
				row.components[0].options.forEach(option => option.setDefault(option.toJSON().value == interaction.values[0]));
				interaction.editReply({ embeds: [HelpEmbed], components: [row, row2] });
			});

			collector.on('end', () => {
				HelpEmbed.setDescription('Help command timed out.')
					.setFooter({ text: 'please do the help command again if you still need a list of commands.' });
				if (message.commandName) message.editReply({ embeds: [HelpEmbed], components: [row2] }).catch(err => logger.warn(err));
				else helpMsg.edit({ embeds: [HelpEmbed], components: [row2] }).catch(err => logger.warn(err));
			});
		}
		catch (err) { client.error(err, message); }
	},
};
