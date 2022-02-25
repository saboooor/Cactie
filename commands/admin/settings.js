const { ButtonComponent, ButtonStyle, ActionRow, Embed } = require('discord.js');
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
			let SettingsEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Bot Settings');
			const components = [];
			// Check if arg is set or is 'reset'
			if (args[1] != null && args[0] != 'reset') {
			// Set prop variable to first argument
				const prop = args[0];

				// Embed for possible error
				const errEmbed = new Embed()
					.setColor(0xE74C3C)
					.addField({ name: 'Too confusing?', value: msg.dashboard });

				// Check if setting exists
				const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
				if (!srvconfig[prop]) SettingsEmbed = errEmbed.setTitle('Invalid setting!');

				// Set value to second argument for slash commands and the rest of the text joined for normal commands
				const value = message.commandName ? args[1].toString() : args.join(' ').replace(`${args[0]} `, '');

				// Avoid users from setting guildId
				if (prop == 'guildId') SettingsEmbed = errEmbed.setTitle('You cannot change that!');
				// Tickets setting can only be either buttons, reactions, or false
				if (prop == 'tickets' && value != 'buttons' && value != 'reactions' && value != 'false') SettingsEmbed = errEmbed.setTitle('This setting must be either `buttons`, `reactions`, or `false`!');
				// Reactions / Bonercmd / Suggestthreads settings can only either be true or false
				if ((prop == 'reactions' || prop == 'bonercmd' || prop == 'suggestthreads') && value != 'true' && value != 'false') SettingsEmbed = errEmbed.setTitle('This setting must be either `true` or `false`!');
				// Leavemessage / Joinmessage can only be enabled if the systemChannel is set (may change later to a separate setting)
				if ((prop == 'leavemessage' || prop == 'joinmessage') && !message.guild.systemChannel && value != 'false') SettingsEmbed = errEmbed.setTitle('Please set a system channel in your server settings first!');
				// Suggestionchannel / Pollchannel / Logchannel can only be a text channel or false
				if ((prop == 'suggestionchannel' || prop == 'pollchannel' || prop == 'logchannel') && value != 'false' && (!message.guild.channels.cache.get(value) || !message.guild.channels.cache.get(value).isText())) SettingsEmbed = errEmbed.setTitle('That is not a valid text channel Id!');
				// Ticketcategory can only be a category channel or false
				if (prop == 'ticketcategory' && value != 'false' && (!message.guild.channels.cache.get(value) || !message.guild.channels.cache.get(value).isCategory())) SettingsEmbed = errEmbed.setTitle('That is not a valid category Id!');
				// Supportrole / Djrole can only be a role
				if ((prop == 'supportrole' || prop == 'djrole') && value != 'false' && !message.guild.roles.cache.get(value)) SettingsEmbed = errEmbed.setTitle('That is not a valid role Id!');
				// Adminrole can only be a role or 'permission'
				if ((prop == 'adminrole') && value != 'permission' && !message.guild.roles.cache.get(value)) SettingsEmbed = errEmbed.setTitle('That is not a valid role Id!');
				// Msgshortener can only be a number
				if ((prop == 'msgshortener' || prop == 'maxppsize') && isNaN(value)) SettingsEmbed = errEmbed.setTitle('That is not a valid number!');
				// Maxppsize can only be less than 76
				if (prop == 'maxppsize' && value > 76) SettingsEmbed = errEmbed.setTitle('maxppsize must be less than 76!');
				// Ticketmention can only be here, everyone, or a valid role
				if ((prop == 'ticketmention') && value != 'everyone' && value != 'here' && value != 'false' && !message.guild.roles.cache.get(value)) SettingsEmbed = errEmbed.setTitle('This setting must be either `here`, `everyone`, or a valid role Id!');
				// Set mutecmd's permissions
				if (prop == 'mutecmd' && value != 'timeout' && value != 'false') {
				// Check if valid role if not false
					const role = message.guild.roles.cache.get(value);
					if (!role) { SettingsEmbed = errEmbed.setTitle('That is not a valid role Id!'); }
					else {
						message.guild.channels.cache.forEach(channel => {
							channel.permissionOverwrites.edit(role, { SEND_MESSAGES: false })
								.catch(e => { client.logger.error(e); });
						});

						// Move the mute role under pup's highest role if not already over it
						const rolepos = message.guild.members.cache.get(client.user.id).roles.highest.rawPosition;
						if (rolepos > role.rawPosition) role.setPosition(rolepos - 1);
					}
				}

				// If there's no error, set the setting
				if (SettingsEmbed != errEmbed) {
				// Set the setting and the embed description / log
					await client.setData('settings', 'guildId', message.guild.id, prop, value);
					SettingsEmbed.setDescription(`Successfully set \`${prop}\` to \`${value}\``);
					client.logger.info(`Successfully set ${prop} to ${value} in ${message.guild.name}`);

					// Check if log channel exists and send message
					const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
					if (logchannel) {
						const logEmbed = new Embed()
							.setAuthor({ name: `${message.member.user.tag} changed a setting`, iconURL: message.member.user.avatarURL() })
							.addField({ name: 'Setting', value: prop })
							.addField({ name: 'Value', value: value });
						logchannel.send({ embeds: [logEmbed] });
					}
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
					.addField({ name: 'Usage', value: '`/settings [<Setting> <Value>]`' })
					.addField({ name: 'Too confusing?', value: msg.dashboard })
					.setFooter({ text: `Page 1 of ${maxPages}` });

				// Add buttons for page changing
				const row = new ActionRow()
					.addComponents(
						new ButtonComponent()
							.setCustomId('settings_prev')
							.setLabel('◄')
							.setStyle(ButtonStyle.Secondary),
						new ButtonComponent()
							.setCustomId('settings_next')
							.setLabel('►')
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
			message.reply({ embeds: [SettingsEmbed], components: components });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};