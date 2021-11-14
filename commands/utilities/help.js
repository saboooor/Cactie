const { MessageButton, MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Get help with Pup',
	aliases: ['commands'],
	botperms: 'ADD_REACTIONS',
	usage: '[Type]',
	cooldown: 10,
	guildOnly: true,
	options: require('../options/help.json'),
	async execute(message, args, client) {
		const srvconfig = client.settings.get(message.guild.id);
		const prefix = await srvconfig.prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('**HELP**');
		let arg = args[0];
		if (arg) arg = arg.toLowerCase();
		if (arg == 'admin') {
			require('../../help/admin.js')(prefix, Embed, srvconfig);
		}
		else if (arg == 'fun') {
			require('../../help/fun.js')(prefix, Embed);
		}
		else if (arg == 'music') {
			require('../../help/music.js')(prefix, Embed);
		}
		else if (arg == 'nsfw') {
			if (!message.channel.nsfw) return message.react('🔞');
			require('../../help/nsfw.js')(prefix, Embed);
		}
		else if (arg == 'tickets') {
			require('../../help/tickets.js')(prefix, Embed);
		}
		else if (arg == 'utilities') {
			require('../../help/utilities.js')(prefix, Embed);
		}
		else if (arg == 'supportpanel') {
			if (!message.member.permissions.has('ADMINISTRATOR')) return;
			Embed.setDescription('Created support panel! You may now delete this message');
			const Panel = new MessageEmbed()
				.setColor(3447003)
				.setTitle('Need help? No problem!')
				.setFooter(`${message.guild.name} Support`, message.guild.iconURL({ dynamic : true }));
			if (srvconfig.tickets == 'buttons') {
				Panel.setDescription('Click the button below to open a ticket!');
				const row = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('create_ticket')
							.setLabel('Open Ticket')
							.setEmoji('🎫')
							.setStyle('PRIMARY'),
					);
				message.channel.send({ embeds: [Panel], components: [row] });
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
			Embed.setDescription('\n\nPlease use the dropdown below to navigate through the help menu');
		}
		const row = new MessageActionRow()
			.addComponents([
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Select a help category!')
					.addOptions([
						{
							label: 'Admin',
							description: 'These commands require specific permissions.',
							value: 'help_admin',
						},
						{
							label: 'Fun',
							description: 'These commands are made just for fun!',
							value: 'help_fun',
						},
						{
							label: 'Music',
							description: 'These commands play music in your voice chat!',
							value: 'help_music',
						},
						{
							label: 'NSFW',
							description: 'These commands have sensitive content that is NSFW',
							value: 'help_nsfw',
						},
						{
							label: 'Tickets',
							description: 'These commands are related to Pup\'s tickets system',
							value: 'help_tickets',
						},
						{
							label: 'Utilities',
							description: 'These commands are useful for some situations',
							value: 'help_utilities',
						},
					]),
			]);
		const row2 = new MessageActionRow()
			.addComponents([
				new MessageButton()
					.setURL('https://pup.smhsmh.club/discord')
					.setLabel('Support Discord')
					.setStyle('LINK'),
				new MessageButton()
					.setURL('https://paypal.me/youhavebeenyoted')
					.setLabel('Donate')
					.setStyle('LINK')]);
		message.reply({ embeds: [Embed], components: [row, row2], ephemeral: true });
	},
};