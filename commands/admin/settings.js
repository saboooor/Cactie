function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonComponent, ButtonStyle, ActionRow, Embed } = require('discord.js');
const { left, right } = require('../../lang/int/emoji.json');
const desc = require('../../lang/en/settingsdesc.json');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'settings',
	description: 'Configure Pup\'s settings in the server',
	aliases: ['setting'],
	usage: '[<Setting> <Value>]',
	permission: 'Administrator',
	options: require('../options/settings.json'),
	async execute(message, args, client) {
		try {
			// Create Embed with title and color
			const SettingsEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Bot Settings');
			const components = [];
			// Check if arg is set or is 'reset'
			if (args[1] != null && args[0] != 'reset') {
				// Set prop variable to first argument
				const prop = args[0];

				// Check if setting exists
				const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
				if (!srvconfig[prop]) return client.error('Invalid setting!', message, true);
				// Set value to second argument for slash commands and the rest of the text joined for normal commands
				const value = message.commandName ? args[1].toString() : args.join(' ').replace(`${args[0]} `, '');

				// Avoid users from setting guildId
				if (prop == 'guildId') return client.error('You can\'t change that!', message, true);
				// Tickets setting can only be either buttons, reactions, or false
				if (prop == 'tickets' && value != 'buttons' && value != 'reactions' && value != 'false') return client.error('This setting must be either "buttons", "reactions", or "false"!', message, true);
				// Reactions / Bonercmd / Suggestthreads settings can only either be true or false
				if ((prop == 'reactions' || prop == 'bonercmd' || prop == 'suggestthreads') && value != 'true' && value != 'false') return client.error('This setting must be either "true", or "false"!', message, true);
				// Leavemessage / Joinmessage can only be enabled if the systemChannel is set (may change later to a separate setting)
				if ((prop == 'leavemessage' || prop == 'joinmessage') && !message.guild.systemChannel && value != 'false') return client.error(`Please set a system channel in ${message.guild.name} settings first!`, message, true);
				// Suggestionchannel / Pollchannel / Logchannel can only be a text channel or false
				if ((prop == 'suggestionchannel' || prop == 'pollchannel' || prop == 'logchannel') && value != 'false' && (!message.guild.channels.cache.get(value) || !message.guild.channels.cache.get(value).isText())) return client.error('That\'s not a valid text channel Id!', message, true);
				// Ticketcategory can only be a category channel or false
				if (prop == 'ticketcategory' && value != 'false' && (!message.guild.channels.cache.get(value) || !message.guild.channels.cache.get(value).isCategory())) return client.error('That\'s not a valid category Id!', message, true);
				// Supportrole / Djrole can only be a role
				if ((prop == 'supportrole' || prop == 'djrole') && value != 'false' && !message.guild.roles.cache.get(value)) return client.error('That\'s not a valid role Id!', message, true);
				// Adminrole can only be a role or 'permission'
				if ((prop == 'adminrole') && value != 'permission' && !message.guild.roles.cache.get(value)) return client.error('That\'s not a valid role Id!', message, true);
				// Msgshortener can only be a number
				if ((prop == 'msgshortener' || prop == 'maxppsize') && isNaN(value)) return client.error('That\'s not a valid number!', message, true);
				// Maxppsize can only be less than 76
				if (prop == 'maxppsize' && value > 76) return client.error('"maxppsize" must be 75 or less!', message, true);
				// Ticketmention can only be here, everyone, or a valid role
				if ((prop == 'ticketmention') && value != 'everyone' && value != 'here' && value != 'false' && !message.guild.roles.cache.get(value)) return client.error('This setting must be either "here", "everyone", or a valid role Id!', message, true);
				// Set mutecmd's permissions
				if (prop == 'mutecmd' && value != 'timeout' && value != 'false') {
				// Check if valid role if not false
					const role = message.guild.roles.cache.get(value);
					if (!role) { return client.error('That is not a valid role Id!', message, true); }
					else {
						message.guild.channels.cache.forEach(channel => {
							channel.permissionOverwrites.edit(role, { SendMessages: false })
								.catch(err => { client.logger.error(err); });
						});

						// Move the mute role under pup's highest role if not already over it
						const rolepos = message.guild.members.cache.get(client.user.id).roles.highest.rawPosition;
						if (rolepos > role.rawPosition) role.setPosition(rolepos - 1);
					}
				}
				// Set the setting and the embed description / log
				await client.setData('settings', 'guildId', message.guild.id, prop, value);
				SettingsEmbed.setDescription(`Successfully set \`${prop}\` to \`${value}\``);
				client.logger.info(`Successfully set ${prop} to ${value} in ${message.guild.name}`);

				// Check if log channel exists and send message
				const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
				if (logchannel) {
					const logEmbed = new Embed()
						.setAuthor({ name: `${message.member.user.tag} changed a setting`, iconURL: message.member.user.avatarURL() })
						.addFields({ name: 'Setting', value: prop })
						.addFields({ name: 'Value', value: value });
					logchannel.send({ embeds: [logEmbed] });
				}
			}
			else if (args[0] == 'reset') {
				// Set title to 'SETTINGS RESET'
				SettingsEmbed.setTitle('**SETTINGS RESET**');

				// Add buttons for reset confirm / deny
				const row = new ActionRow()
					.addComponents(
						new ButtonComponent()
							.setCustomId('settings_reset')
							.setLabel('Reset Settings')
							.setStyle(ButtonStyle.Danger),
					)
					.addComponents(
						new ButtonComponent()
							.setCustomId('settings_nevermind')
							.setLabel('Nevermind')
							.setStyle(ButtonStyle.Primary),
					);
				components.push(row);
			}
			else {
				// Get settings and make an array out of it to split and make pages
				const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
				const configlist = Object.keys(srvconfig).map(prop => {
					return `**${prop}**\n${desc[prop]}\n\`${srvconfig[prop]}\``;
				});
				const maxPages = Math.ceil(configlist.length / 5);

				// Set embed description with page and stuff
				SettingsEmbed.setDescription(configlist.slice(0, 4).join('\n'))
					.addFields({ name: 'Usage', value: '`/settings [<Setting> <Value>]`' })
					.setFooter({ text: `Page 1 of ${maxPages}` });
				if (client.user.id == '765287593762881616') SettingsEmbed.addFields({ name: 'Too confusing?', value: msg.dashboard });

				// Add buttons for page changing
				const row = new ActionRow()
					.addComponents(
						new ButtonComponent()
							.setCustomId('settings_prev')
							.setEmoji({ id: left })
							.setStyle(ButtonStyle.Secondary),
						new ButtonComponent()
							.setCustomId('settings_next')
							.setEmoji({ id: right })
							.setStyle(ButtonStyle.Secondary),
						new ButtonComponent()
							.setURL('https://pup.smhsmh.club')
							.setLabel('Dashboard')
							.setStyle(ButtonStyle.Link),
					);
				components.push(row);
			}

			// If there aren't any buttons, add a button for dashboard
			if (!components[0]) {
				const row = new ActionRow()
					.addComponents(
						new ButtonComponent()
							.setURL('https://pup.smhsmh.club')
							.setLabel('Dashboard')
							.setStyle(ButtonStyle.Link),
					);
				components.push(row);
			}

			// Send Embed with buttons
			const SettingsMsg = await message.reply({ embeds: [SettingsEmbed], components: components });

			if (args[0] == 'reset') {
				const collector = SettingsMsg.createMessageComponentCollector({ time: 30000 });
				collector.on('collect', async interaction => {
					// Check if the button is one of the settings buttons
					if (!interaction.customId.startsWith('settings_')) return;
					interaction.deferUpdate();

					// Check if button is confirm reset or nevermind
					if (interaction.component.customId == 'settings_reset') {
						// Delete settings database for guild and reply
						client.delData('settings', 'guildId', interaction.guild.id);
						SettingsEmbed.setDescription('Settings successfully reset!');
						SettingsMsg.edit({ components: [], embeds: [SettingsEmbed] });

						// Delete message after 5 seconds
						await sleep(5000);
						await collector.stop();
					}
					else if (interaction.component.customId == 'settings_nevermind') {
						// Delete message and command message
						await collector.stop();
					}
				});

				// When the collector stops, remove the undo button from it
				collector.on('end', () => {
					SettingsMsg.delete();
					if (!message.commandName) message.delete();
				});
			}
		}
		catch (err) { client.error(err, message); }
	},
};