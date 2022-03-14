const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Get help with Pup',
	aliases: ['commands'],
	botperm: 'AddReactions',
	usage: '[Type]',
	cooldown: 10,
	options: require('../options/help.json'),
	async execute(message, args, client) {
		try {
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const prefix = await srvconfig.prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
			const HelpEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('**HELP**');
			let arg = args[0];
			if (arg) arg = arg.toLowerCase();
			if (arg == 'admin' || arg == 'fun' || arg == 'animals' || arg == 'music' || arg == 'nsfw' || arg == 'tickets' || arg == 'utilities' || arg == 'actions') {
				if (arg == 'nsfw' && !message.channel.nsfw) return message.react('🔞').catch(err => client.logger.error(err));
				require(`../../help/${arg}.js`)(prefix, HelpEmbed, srvconfig);
			}
			else if (arg == 'supportpanel') {
				if (!message.member.permissions.has('ADMINISTRATOR')) return;
				const Panel = new EmbedBuilder()
					.setColor(0x5662f6)
					.setTitle('Need help? No problem!')
					.setFooter({ text: `${message.guild.name} Support`, iconURL: message.guild.iconURL() });
				if (srvconfig.tickets == 'buttons') {
					Panel.setDescription('Click the button below to open a ticket!');
					const row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId('create_ticket')
								.setLabel('Open Ticket')
								.setEmoji({ name: '🎫' })
								.setStyle(ButtonStyle.Primary),
						);
					message.channel.send({ embeds: [Panel], components: [row] });
					return message.reply('Support panel created! You may now delete this message');
				}
				else if (srvconfig.tickets == 'reactions') {
					Panel.setDescription('React with 🎫 to open a ticket!');
					const msg = await message.channel.send({ embeds: [Panel] });
					await msg.react('🎫');
				}
				else if (srvconfig.tickets == 'false') {
					return message.reply({ content: 'Tickets are disabled!' });
				}
			}
			else {
				HelpEmbed.setDescription('Please use the dropdown below to navigate through the help menu\n\n**Options:**\nAdmin, Fun, Animals, Music, NSFW, Tickets, Utilities, Actions');
			}
			const row = new ActionRowBuilder()
				.addComponents(
					new SelectMenuBuilder()
						.setCustomId('help_menu')
						.setPlaceholder('Select a help category!')
						.setOptions(
							new SelectMenuOptionBuilder()
								.setLabel('Admin')
								.setDescription('These commands require specific permissions')
								.setValue('help_admin')
								.setDefault(arg == 'admin'),
							new SelectMenuOptionBuilder()
								.setLabel('Fun')
								.setDescription('These commands are made just for fun')
								.setValue('help_fun')
								.setDefault(arg == 'fun'),
							new SelectMenuOptionBuilder()
								.setLabel('Animals')
								.setDescription('These commands show cute animals')
								.setValue('help_animals')
								.setDefault(arg == 'animals'),
							new SelectMenuOptionBuilder()
								.setLabel('Music')
								.setDescription('These commands play music in your voice chat')
								.setValue('help_music')
								.setDefault(arg == 'music'),
							new SelectMenuOptionBuilder()
								.setLabel('NSFW')
								.setDescription('These commands have sensitive content that is NSFW')
								.setValue('help_nsfw')
								.setDefault(arg == 'nsfw'),
							new SelectMenuOptionBuilder()
								.setLabel('Tickets')
								.setDescription('These commands are related to Pup\'s tickets system')
								.setValue('help_tickets')
								.setDefault(arg == 'tickets'),
							new SelectMenuOptionBuilder()
								.setLabel('Utilities')
								.setDescription('These commands are useful for some situations')
								.setValue('help_utilities')
								.setDefault(arg == 'utilities'),
							new SelectMenuOptionBuilder()
								.setLabel('Actions')
								.setDescription('These commands let you do stuff to people idk')
								.setValue('help_actions')
								.setDefault(arg == 'actions'),
						),
				);
			const row2 = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setURL('https://pup.smhsmh.club/discord')
						.setLabel('Support Discord')
						.setStyle(ButtonStyle.Link),
					new ButtonBuilder()
						.setURL('https://paypal.me/youhavebeenyoted')
						.setLabel('Donate')
						.setStyle(ButtonStyle.Link),
				);
			const msg = await message.reply({ embeds: [HelpEmbed], components: [row, row2] });

			const collector = msg.createMessageComponentCollector({ time: 3600000 });
			collector.on('collect', async interaction => {
				if (interaction.customId != 'help_menu') return;
				await interaction.deferUpdate();
				HelpEmbed.setFields();
				if (interaction.values[0] == 'help_nsfw' && !msg.channel.nsfw) HelpEmbed.setDescription('**NSFW commands are only available in NSFW channels.**\nThis is not an NSFW channel!');
				else require(`../../help/${interaction.values[0].split('_')[1]}.js`)(prefix, HelpEmbed, srvconfig);
				row.components[0].options.forEach(option => option.setDefault(option.data.value == interaction.values[0]));
				msg.edit({ embeds: [HelpEmbed], components: [row, row2] });
			});

			collector.on('end', () => {
				HelpEmbed.setDescription('Help command timed out.')
					.setFooter({ text: 'please do the help command again if you still need a list of commands.' });
				msg.edit({ embeds: [HelpEmbed], components: [row2] });
			});
		}
		catch (err) { client.error(err, message); }
	},
};