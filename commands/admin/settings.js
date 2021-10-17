const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const desc = require('../../config/settingsdesc.json');
module.exports = {
	name: 'settings',
	description: 'Configure Pup\'s settings in the server',
	aliases: ['setting'],
	usage: '[<Setting> <Value>]',
	permissions: 'ADMINISTRATOR',
	guildOnly: true,
	advancedCommand: true,
	options: require('../options/settings.json'),
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args[0] = args._subcommand;
			args[1] = args._hoistedOptions[0] ? args._hoistedOptions[0].value : null;
		}
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Bot Settings');
		if (args[1] != null && args[0] != 'reset') {
			const prop = args[0];
			if (!client.settings.has(message.guild.id, prop)) return message.reply({ content: 'Invalid setting!' });
			const value = message.commandName ? args[1].toString() : args.join(' ').replace(`${args[0]} `, '');
			if (prop == 'tickets' && value != 'buttons' && value != 'reactions' && value != 'false') return message.reply({ content: 'This setting must be either `buttons`, `reactions`, or `false`!' });
			if ((prop == 'reactions' || prop == 'bonercmd' || prop == 'ticketmention' || prop == 'mutecmd') && value != 'true' && value != 'false') return message.reply({ content: 'This setting must be either `true` or `false`!' });
			if ((prop == 'leavemessage' || prop == 'joinmessage') && !message.guild.systemChannel && value != 'false') return message.reply({ content: 'Please set a system channel in your server settings first!' });
			if (prop == 'maxppsize' && value > 76) return message.reply({ content: 'maxppsize must be less than 76!' });
			if ((prop == 'suggestionchannel' || prop == 'pollchannel' || prop == 'ticketlogchannel') && value != 'default' && value != 'false' && (!message.guild.channels.cache.get(value) || message.guild.channels.cache.get(value).type != 'GUILD_TEXT')) return message.reply({ content: 'That is not a valid text channel Id!' });
			if (prop == 'ticketcategory' && value != 'false' && (!message.guild.channels.cache.get(value) || message.guild.channels.cache.get(value).type != 'GUILD_CATEGORY')) return message.reply({ content: 'That is not a valid category Id!' });
			if ((prop == 'supportrole' || prop == 'muterole' || prop == 'djrole') && !message.guild.roles.cache.get(value)) return message.reply({ content: 'That is not a valid role Id!' });
			if ((prop == 'adminrole') && value != 'permission' && !message.guild.roles.cache.get(value)) return message.reply({ content: 'That is not a valid role Id!' });
			if ((prop == 'msgshortener') && isNaN(value)) return message.reply({ content: 'That is not a valid number!' });
			if (prop == 'muterole') {
				const role = message.guild.roles.cache.get(value);
				message.guild.channels.cache.forEach(channel => {
					channel.permissionOverwrites.edit(role, { SEND_MESSAGES: false })
						.catch(e => { client.logger.error(e); });
				});
			}
			client.settings.set(message.guild.id, value, prop);
			Embed.setDescription(`Successfully set \`${prop}\` to \`${value}\``);
			client.logger.info(`Successfully set ${prop} to ${value} in ${message.guild.name}`);
		}
		else if (args[0] == 'reset') {
			Embed.setTitle('**SETTINGS RESET**');
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
			return message.reply({ embeds: [Embed], components: [row], ephemeral: true });
		}
		else {
			const srvconfig = client.settings.get(message.guild.id);
			const configlist = Object.keys(srvconfig).map(prop => {
				return `**${prop}**\n${desc[prop]}\n\`${srvconfig[prop]}\``;
			});
			const maxPages = Math.ceil(configlist.length / 5);
			Embed
				.setDescription(configlist.slice(0, 4).join('\n'))
				.addField('Usage', `\`${srvconfig.prefix}settings [<Setting> <Value>]\``)
				.setFooter(`Page 1 of ${maxPages}`);
		}
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
			);
		message.reply({ embeds: [Embed], components: [row], ephemeral: true });
	},
};