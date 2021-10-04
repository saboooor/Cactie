const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
module.exports = {
	name: 'settings',
	description: 'Configure Pup Bot\'s settings',
	aliases: ['setting'],
	usage: '[<Setting> <Value>]',
	permissions: 'ADMINISTRATOR',
	guildOnly: true,
	options: [
		{
			type: 1,
			name: 'get',
			description: 'Show all settings',
		},
		{
			type: 1,
			name: 'prefix',
			description: 'The bot\'s prefix',
			options: [
				{
					type: 3,
					name: 'prefix',
					description: 'The bot\'s prefix',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'reactions',
			description: 'Reacts with various reactions on some words',
			options: [
				{
					type: 5,
					name: 'value',
					description: 'The setting value',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'leavemessage',
			description: 'The message when someone leaves the guild',
			options: [
				{
					type: 3,
					name: 'value',
					description: 'Must be false or the leave message. Variables: {USER MENTION} {USER TAG}',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'joinmessage',
			description: 'The message when someone joins the guild',
			options: [
				{
					type: 3,
					name: 'value',
					description: 'Must be false or the join message. Variables: {USER MENTION} {USER TAG}',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'maxppsize',
			description: 'Maximum pp size in boner and instaboner commands',
			options: [
				{
					type: 4,
					name: 'size',
					description: 'The max pp size (<75)',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'tickets',
			description: 'Toggles the ticket system',
			options: [
				{
					type: 3,
					name: 'value',
					description: 'The setting value',
					choices: [{
						name: 'buttons',
						value: 'buttons',
					},
					{
						name: 'reactions',
						value: 'reactions',
					},
					{
						name: 'false',
						value: 'false',
					}],
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'bonercmd',
			description: 'Toggles the boner command',
			options: [
				{
					type: 5,
					name: 'value',
					description: 'The setting value',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'suggestionchannel',
			description: 'The channel where the bot puts suggestions in',
			options: [
				{
					type: 7,
					name: 'channel',
					description: 'The suggestion channel (Hashtag icon)',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'pollchannel',
			description: 'The channel where the bot puts polls in',
			options: [
				{
					type: 7,
					name: 'channel',
					description: 'The poll channel (Hashtag icon)',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'ticketlogchannel',
			description: 'The channel where the bot puts ticket logs, Must be false or a channel Id',
			options: [
				{
					type: 7,
					name: 'channel',
					description: 'The channel (Hashtag icon)',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'ticketcategory',
			description: 'The category where the bot creates tickets in, Must be false or a category Id',
			options: [
				{
					type: 7,
					name: 'value',
					description: 'The category (Folder icon)',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'ticketmention',
			description: 'Pings @everyone every time a new ticket is created',
			options: [
				{
					type: 5,
					name: 'value',
					description: 'The setting value',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'supportrole',
			description: 'The ticket support team role',
			options: [
				{
					type: 8,
					name: 'role',
					description: 'The support role',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'muterole',
			description: 'The role to give when muting someone',
			options: [
				{
					type: 8,
					name: 'role',
					description: 'The mute role',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'mutecmd',
			description: 'Toggles the mute command',
			options: [
				{
					type: 5,
					name: 'value',
					description: 'The setting value',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'adminrole',
			description: 'The role to replace the ADMINISTRATOR permission',
			options: [
				{
					type: 8,
					name: 'role',
					description: 'The admin role',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'msgshortener',
			description: 'The amount of lines in a message to trigger message shortener',
			options: [
				{
					type: 3,
					name: 'number',
					description: '[0 = disabled]',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'djrole',
			description: 'The DJ feature of the bot that limits the skip/etc commands',
			options: [
				{
					type: 8,
					name: 'role',
					description: 'The role to use for the DJ role',
					required: true,
				},
			],
		},
	],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args[0] = args._subCommand;
			args[1] = args._hoistedOptions[0] ? args._hoistedOptions[0].value : null;
		}
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Bot Settings');
		if (args[1] == 'get') args[1] == null;
		if (args[1] != null) {
			const prop = args[0];
			if (!client.settings.has(message.guild.id, prop)) return message.reply({ content: 'Invalid setting!' });
			const value = message.commandName ? args[1].toString() : args.join(' ').replace(`${args[0]} `, '');
			if (prop == 'tickets' && value != 'buttons' && value != 'reactions' && value != 'false') return message.reply({ content: 'This setting must be either `buttons`, `reactions`, or `false`!' });
			if ((prop == 'reactions' || prop == 'bonercmd' || prop == 'ticketmention' || prop == 'mutecmd') && value != 'true' && value != 'false') return message.reply({ content: 'This setting must be either `true` or `false`!' });
			if ((prop == 'leavemessage' || prop == 'joinmessage') && !message.guild.systemChannel && value != 'false') return message.reply({ content: 'Please set a system channel in your server settings first!' });
			if (prop == 'maxppsize' && value > 76) return message.reply({ content: 'maxppsize must be less than 76!' });
			if ((prop == 'suggestionchannel' || prop == 'pollchannel' || prop == 'ticketlogchannel') && value != 'default' && value != 'false' && (!client.channels.cache.get(value) || client.channels.cache.get(value).type != 'GUILD_TEXT')) return message.reply({ content: 'That is not a valid text channel Id!' });
			if (prop == 'ticketcategory' && value != 'false' && (!client.channels.cache.get(value) || client.channels.cache.get(value).type != 'GUILD_CATEGORY')) return message.reply({ content: 'That is not a valid category Id!' });
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
		else {
			const desc = {
				prefix: '*The bot\'s prefix*',
				reactions: '*Reacts with various reactions on some words (true/false)*\nDo /reactions to see a list of them',
				leavemessage: '*The message when someone leaves the guild. (<message>/false)\nVariables: {USER MENTION} {USER TAG}*',
				joinmessage: '*The message when someone joins the guild. (<message>/false)\nVariables: {USER MENTION} {USER TAG}*',
				maxppsize: '*Maximum pp size in boner and instaboner commands (<75)*',
				tickets: '*Toggles the ticket system (buttons/reactions/false)*',
				bonercmd: '*Toggles the boner command (true/false)*',
				suggestionchannel: '*The channel where the bot puts suggestions in (false/default/channelId)*',
				pollchannel: '*The channel where the bot puts polls in (false/default/channelId)*',
				ticketlogchannel: '*The channel where the bot puts ticket logs (false/channelId)*',
				ticketcategory: '*The category where the bot creates tickets in (false/categoryId)*',
				supportrole: '*The ticket support team role (roleId)*',
				ticketmention: '*Pings @everyone every time a new ticket is created (true/false)*',
				muterole: '*The role for muting someone (false/roleId)*',
				mutecmd: '*Toggles the mute command (true/false)*',
				adminrole: '*The role to replace the ADMINISTRATOR permission (permission/roleId)*',
				msgshortener: '*The amount of lines in a message to trigger message shortener (number [0 = false])*',
				djrole: '*The DJ feature of the bot that limits the skip/etc commands (false/roleId)*',
			};
			const srvconfig = Object.keys(client.settings.get(message.guild.id)).map(prop => {
				return `**${prop}**\n${desc[prop]}\n\`${client.settings.get(message.guild.id)[prop]}\``;
			});
			Embed.setDescription(srvconfig.join('\n')).addField('Usage', `\`${client.settings.get(message.guild.id).prefix}settings [<Setting> <Value>]\``);
		}
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('reset')
					.setLabel('Reset Settings')
					.setStyle('DANGER'),
			);
		message.reply({ embeds: [Embed], components: [row], ephemeral: true });
	},
};