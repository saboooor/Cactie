const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const desc = require('../../config/settingsdesc.json');
module.exports = {
	name: 'settings',
	description: 'Configure Pup\'s settings in the server',
	ephemeral: true,
	aliases: ['setting'],
	usage: '[<Setting> <Value>]',
	permissions: 'ADMINISTRATOR',
	guildOnly: true,
	options: require('../options/settings.json'),
	async execute(message, args, client) {
		// Create Embed with title and color
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Bot Settings');

		// Check if arg is set or is 'reset'
		if (args[1] != null && args[0] != 'reset') {
			// Set prop variable to first argument
			const prop = args[0];

			// Check if setting exists
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (!srvconfig[prop]) return message.reply({ content: 'Invalid setting!' });

			// Set value to second argument for slash commands and the rest of the text joined for normal commands
			const value = message.commandName ? args[1].toString() : args.join(' ').replace(`${args[0]} `, '');

			// Tickets setting can only be either buttons, reactions, or false
			if (prop == 'tickets' && value != 'buttons' && value != 'reactions' && value != 'false') return message.reply({ content: 'This setting must be either `buttons`, `reactions`, or `false`!' });
			// Reactions / Bonercmd / Suggestthreads settings can only either be true or false
			if ((prop == 'reactions' || prop == 'bonercmd' || prop == 'suggestthreads') && value != 'true' && value != 'false') return message.reply({ content: 'This setting must be either `true` or `false`!' });
			// Leavemessage / Joinmessage can only be enabled if the systemChannel is set (may change later to a separate setting)
			if ((prop == 'leavemessage' || prop == 'joinmessage') && !message.guild.systemChannel && value != 'false') return message.reply({ content: 'Please set a system channel in your server settings first!' });
			// Suggestionchannel / Pollchannel / Logchannel can only be a text channel or false
			if ((prop == 'suggestionchannel' || prop == 'pollchannel' || prop == 'logchannel') && value != 'false' && (!message.guild.channels.cache.get(value) || message.guild.channels.cache.get(value).type != 'GUILD_TEXT')) return message.reply({ content: 'That is not a valid text channel Id!' });
			// Ticketcategory can only be a category channel or false
			if (prop == 'ticketcategory' && value != 'false' && (!message.guild.channels.cache.get(value) || message.guild.channels.cache.get(value).type != 'GUILD_CATEGORY')) return message.reply({ content: 'That is not a valid category Id!' });
			// Supportrole / Djrole can only be a role
			if ((prop == 'supportrole' || prop == 'djrole') && !message.guild.roles.cache.get(value)) return message.reply({ content: 'That is not a valid role Id!' });
			// Adminrole can only be a role or 'permission'
			if ((prop == 'adminrole') && value != 'permission' && !message.guild.roles.cache.get(value)) return message.reply({ content: 'That is not a valid role Id!' });
			// Msgshortener can only be a number
			if ((prop == 'msgshortener' || prop == 'maxppsize') && isNaN(value)) return message.reply({ content: 'That is not a valid number!' });
			// Maxppsize can only be less than 76
			if (prop == 'maxppsize' && value > 76) return message.reply({ content: 'maxppsize must be less than 76!' });
			// Ticketmention can only be here, everyone, or a valid role
			if ((prop == 'ticketmention') && value != 'everyone' && value != 'here' && value != 'false' && !message.guild.roles.cache.get(value)) return message.reply({ content: 'This setting must be either `here`, `everyone`, or a valid role Id!' });
			// Set mutecmd's permissions
			if (prop == 'mutecmd') {
				// Check if valid role if not false
				const role = message.guild.roles.cache.get(value);
				if (!role && value != 'false') { return message.reply('That is not a valid role Id!'); }
				else if (value != 'false') {
					message.guild.channels.cache.forEach(channel => {
						channel.permissionOverwrites.edit(role, { SEND_MESSAGES: false })
							.catch(e => { client.logger.error(e); });
					});

					// Move the mute role under pup's highest role if not already over it
					const rolepos = message.guild.members.cache.get(client.user.id).roles.highest.rawPosition;
					if (rolepos > role.rawPosition) role.setPosition(rolepos - 1);
				}
			}

			// Set the setting and the embed description / log
			await client.setData('settings', 'guildId', message.guild.id, prop, value);
			Embed.setDescription(`Successfully set \`${prop}\` to \`${value}\``);
			client.logger.info(`Successfully set ${prop} to ${value} in ${message.guild.name}`);

			// Check if log channel exists and send message
			const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
			if (logchannel) {
				Embed.setDescription(`${message.member.user.tag} ${Embed.title}`);
				logchannel.send({ embeds: [Embed] });
			}
		}
		else if (args[0] == 'reset') {
			// Set title to 'SETTINGS RESET'
			Embed.setTitle('**SETTINGS RESET**');

			// Add buttons for reset confirm / deny
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('settings_reset')
						.setLabel('Reset Settings')
						.setStyle('DANGER'),
				)
				.addComponents(
					new MessageButton()
						.setCustomId('settings_nevermind')
						.setLabel('Nevermind')
						.setStyle('PRIMARY'),
				);

			// Send Embed with buttons
			return message.reply({ embeds: [Embed], components: [row] });
		}
		else {
			// Get settings and make an array out of it to split and make pages
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const configlist = Object.keys(srvconfig).map(prop => {
				return `**${prop}**\n${desc[prop]}\n\`${srvconfig[prop]}\``;
			});
			const maxPages = Math.ceil(configlist.length / 5);

			// Set embed description with page and stuff
			Embed.setDescription(configlist.slice(0, 4).join('\n'))
				.addField('Usage', `\`${srvconfig.prefix}settings [<Setting> <Value>]\``)
				.setFooter(`Page 1 of ${maxPages}`);
		}

		// Add buttons for page changing
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('settings_prev')
					.setLabel('◄')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('settings_next')
					.setLabel('►')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setURL('https://pup.smhsmh.club')
					.setLabel('Dashboard')
					.setStyle('LINK'),
			);
		Embed.addField('Too confusing?', 'Use the dashboard!');
		// Send Embed with buttons
		message.reply({ embeds: [Embed], components: [row] });
	},
};