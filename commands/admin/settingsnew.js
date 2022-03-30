function capFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SelectMenuBuilder, SelectMenuOptionBuilder } = require('discord.js');
const { left, right, on, off } = require('../../lang/int/emoji.json');
const modal = require('../../lang/int/settingsmodal.json');
module.exports = {
	name: 'settingsnew',
	description: 'Configure Cactie\'s settings in the server',
	aliases: ['setting'],
	usage: '[Setting]',
	permission: 'Administrator',
	options: require('../options/settingsnew.json'),
	async execute(message, args, client) {
		try {
			// Get the settings descriptions
			const desc = require(`../../lang/${message.lang.language.name}/settingsdesc.json`);

			// Create Embed with title and color
			const SettingsEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Bot Settings');

			// Get settings and make an array out of it to split and make pages
			let srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const settingbtns = new ActionRowBuilder();
			let configlist = Object.keys(srvconfig).slice(0, 5).map(prop => {
				const btn = new ButtonBuilder()
					.setCustomId(`settings_prop_${prop}`)
					.setLabel(capFirstLetter(prop))
					.setStyle(ButtonStyle.Secondary);
				if (modal[prop] && modal[prop].type == 'bool') {
					btn.setStyle(srvconfig[prop] == 'false' ? ButtonStyle.Danger : ButtonStyle.Success)
						.setEmoji({ id: srvconfig[prop] == 'false' ? off : on });
				}
				if (prop == 'guildId') btn.setStyle(ButtonStyle.Danger).setLabel('Reset');
				settingbtns.addComponents(btn);
				return `**${prop}**\n${desc[prop]}\n\`${srvconfig[prop]}\``;
			});
			const maxPages = Math.ceil(Object.keys(srvconfig).length / 5);

			// Set embed description with page and stuff
			SettingsEmbed.setDescription(configlist.join('\n'))
				.addFields({ name: 'Usage', value: 'Click the buttons below to edit the specified setting or navigate' })
				.setFooter({ text: message.lang.page.replace('${1}', '1').replace('${2}', maxPages) });
			if (client.user.id == '848775888673439745') SettingsEmbed.addFields({ name: message.lang.dashboard.confusing, value: message.lang.dashboard.use });

			// Add buttons for page changing
			const pages = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('settings_page_prev')
						.setEmoji({ id: left })
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('settings_page_next')
						.setEmoji({ id: right })
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setURL('https://cactie.smhsmh.club')
						.setLabel(message.lang.dashboard.name)
						.setStyle(ButtonStyle.Link),
				);
			const SettingsMsg = await message.reply({ embeds: [SettingsEmbed], components: [settingbtns, pages] });

			const filter = i => i.customId.startsWith('settings_') && i.user.id == message.member.id;
			const collector = SettingsMsg.createMessageComponentCollector({ filter, time: 120000 });
			collector.on('collect', async interaction => {
				const button = interaction.component.customId.split('_');

				if (button[1] == 'page') {
					// Defer interaction
					interaction.deferUpdate();

					// Calculate total amount of pages and get current page from embed footer
					const lastPage = parseInt(SettingsEmbed.toJSON().footer ? SettingsEmbed.toJSON().footer.text.split(' ')[1] : maxPages);

					// Get next page (if last page, go to pg 1)
					// Or get prev page (if first page, go to last page)
					const next = lastPage + 1 == maxPages + 1 ? 1 : lastPage + 1;
					const prev = lastPage - 1 ? lastPage - 1 : maxPages;
					const page = button[2] == 'prev' ? prev : next;
					const end = page * 5;
					const start = end - 5;

					settingbtns.setComponents();
					configlist = Object.keys(srvconfig).slice(start, end).map(prop => {
						const btn = new ButtonBuilder()
							.setCustomId(`settings_prop_${prop}`)
							.setLabel(capFirstLetter(prop))
							.setStyle(ButtonStyle.Secondary);
						if (modal[prop] && modal[prop].type == 'bool') {
							btn.setStyle(srvconfig[prop] == 'false' ? ButtonStyle.Danger : ButtonStyle.Success)
								.setEmoji({ id: srvconfig[prop] == 'false' ? off : on });
						}
						if (prop == 'guildId') btn.setStyle(ButtonStyle.Danger).setLabel('Reset');
						settingbtns.addComponents(btn);
						return `**${prop}**\n${desc[prop]}\n\`${srvconfig[prop]}\``;
					});

					// Update embed description with new page and reply
					SettingsEmbed.setDescription(configlist.join('\n'))
						.setFooter({ text: `Page ${page} of ${maxPages}` });
					SettingsMsg.edit({ embeds: [SettingsEmbed], components: [settingbtns, pages] });
				}
				else if (button[1] == 'prop') {
					if (modal[button[2]].type == 'text') {
						// Create and show a modal for the user to fill out the settings's value
						const propModal = new ModalBuilder()
							.setTitle(`Set the new value for ${button[2]}`)
							.setCustomId(button.join('_'))
							.addComponents(
								new ActionRowBuilder().addComponents(
									new TextInputBuilder()
										.setCustomId('value')
										.setLabel(button[2])
										.setValue(`${srvconfig[button[2]]}`)
										.setPlaceholder(modal[button[2]].placeholder)
										.setStyle(TextInputStyle[modal[button[2]].style])
										.setMinLength(modal[button[2]].min)
										.setMaxLength(modal[button[2]].max),
								),
							);
						interaction.showModal(propModal);
					}
					else if (modal[button[2]].type == 'bool') {
						interaction.deferUpdate();
						const value = srvconfig[button[2]] == 'false' ? 'true' : 'false';
						await client.setData('settings', 'guildId', message.guild.id, button[2], value);
						client.logger.info(`Successfully set ${button[2]} to ${value} in ${message.guild.name}`);
						srvconfig = await client.getData('settings', 'guildId', message.guild.id);
						const page = parseInt(SettingsEmbed.toJSON().footer ? SettingsEmbed.toJSON().footer.text.split(' ')[1] : maxPages);
						const end = page * 5;
						const start = end - 5;

						settingbtns.setComponents();
						configlist = Object.keys(srvconfig).slice(start, end).map(prop => {
							const btn = new ButtonBuilder()
								.setCustomId(`settings_prop_${prop}`)
								.setLabel(prop)
								.setStyle(ButtonStyle.Secondary);
							if (modal[prop] && modal[prop].type == 'bool') {
								btn.setStyle(srvconfig[prop] == 'false' ? ButtonStyle.Danger : ButtonStyle.Success)
									.setEmoji({ id: srvconfig[prop] == 'false' ? off : on });
							}
							if (prop == 'guildId') btn.setStyle(ButtonStyle.Danger).setLabel('Reset');
							settingbtns.addComponents(btn);
							return `**${prop}**\n${desc[prop]}\n\`${srvconfig[prop]}\``;
						});

						// Update embed description with new page and reply
						SettingsEmbed.setDescription(configlist.join('\n'));
						SettingsMsg.edit({ embeds: [SettingsEmbed], components: [settingbtns, pages] });
					}
					else if (modal[button[2]].type == 'select') {
						interaction.deferUpdate();
						const menu = new SelectMenuBuilder()
							.setCustomId(`settings_menu_${button[2]}`)
							.setPlaceholder(`Select a new value for ${button[2]}`);
						modal[button[2]].options.forEach(option => {
							menu.addOptions(
								new SelectMenuOptionBuilder()
									.setLabel(option)
									.setValue(option),
							);
						});
						const row = new ActionRowBuilder().addComponents(menu);
						const menuMsg = await interaction.message.reply({ content: '\u200b', components: [row] });
						const menufilter = i => i.user.id == message.member.id;
						const menuCollector = menuMsg.createMessageComponentCollector({ menufilter, time: 60000 });
						menuCollector.on('collect', async menuint => {
							await client.setData('settings', 'guildId', message.guild.id, button[2], menuint.values[0]);
							client.logger.info(`Successfully set ${button[2]} to ${menuint.values[0]} in ${message.guild.name}`);
							menuint.reply({ content: `**Successfully set ${button[2]} to ${menuint.values[0]}!**` });
							menuCollector.stop();
						});
						menuCollector.on('end', () => menuMsg.delete());
					}
					else if (modal[button[2]].type == 'id') {
						interaction.deferUpdate();
						const idMsg = await interaction.message.reply({ content: `**Reply to this message with a ${modal[button[2]].from.replace('s', '')}!** (You may also put an Id)\nReply with 'false' to disable this setting.${modal[button[2]].additional ? `\n\n**You may also set this setting to either of these other options:**\n\`${modal[button[2]].additional.join(', ')}\`` : ''}` });
						const msgfilter = m => m.reference.messageId == idMsg.id && m.member.id == message.member.id;
						const idcollector = idMsg.channel.createMessageCollector({ msgfilter, time: 60000 });
						idcollector.on('collect', async msg => {
							const obj = msg.guild[modal[button[2]].from].cache.get(msg.content.replace(/\D/g, ''));
							if (!obj && msg.content != 'false' && (modal[button[2]].additional ? !modal[button[2]].additional.some(word => msg.content == word) : true)) return msg.reply({ content: `**That is not a valid ${modal[button[2]].from.replace('s', '')} or option!**` });
							let val = msg.content;
							if (obj) val = obj.id;
							await client.setData('settings', 'guildId', message.guild.id, button[2], val);
							client.logger.info(`Successfully set ${button[2]} to ${val} in ${message.guild.name}`);
							msg.reply({ content: `**Successfully set ${button[2]} to ${obj ? `${obj.name} (Id: ${obj.id})` : val}!**` });
							idcollector.stop();
						});
						idcollector.on('end', () => idMsg.delete());
					}
				}
			});

			// When the collector stops, delete the message
			collector.on('end', () => {
				SettingsMsg.delete();
				if (!message.commandName) message.delete();
			});
		}
		catch (err) { client.error(err, message); }
	},
};