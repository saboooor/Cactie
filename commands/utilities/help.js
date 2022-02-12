const { ButtonComponent, ActionRow, Embed, MessageSelectMenu } = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Get help with Pup',
	aliases: ['commands'],
	botperm: 'ADD_REACTIONS',
	usage: '[Type]',
	cooldown: 10,
	options: require('../options/help.json'),
	async execute(message, args, client) {
		try {
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const prefix = await srvconfig.prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
			const HelpEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('**HELP**');
			let arg = args[0];
			if (arg) arg = arg.toLowerCase();
			if (arg == 'admin' || arg == 'fun' || arg == 'music' || arg == 'nsfw' || arg == 'tickets' || arg == 'utilities') {
				if (arg == 'nsfw' && !message.channel.nsfw) return message.react('🔞').catch(e => client.logger.error(e));
				require(`../../help/${arg}.js`)(prefix, HelpEmbed, srvconfig);
			}
			else if (arg == 'supportpanel') {
				if (!message.member.permissions.has('ADMINISTRATOR')) return;
				HelpEmbed.setDescription('Created support panel! You may now delete this message');
				const Panel = new Embed()
					.setColor(0x5662f6)
					.setTitle('Need help? No problem!')
					.setFooter({ text: `${message.guild.name} Support`, iconURL: message.guild.iconURL({ dynamic : true }) });
				if (srvconfig.tickets == 'buttons') {
					Panel.setDescription('Click the button below to open a ticket!');
					const row = new ActionRow()
						.addComponents(
							new ButtonComponent()
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
				HelpEmbed.setDescription('\n\nPlease use the dropdown below to navigate through the help menu');
			}
			const row = new ActionRow()
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
			const row2 = new ActionRow()
				.addComponents([
					new ButtonComponent()
						.setURL('https://pup.smhsmh.club/discord')
						.setLabel('Support Discord')
						.setStyle('LINK'),
					new ButtonComponent()
						.setURL('https://paypal.me/youhavebeenyoted')
						.setLabel('Donate')
						.setStyle('LINK')]);
			message.reply({ embeds: [HelpEmbed], components: [row, row2] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};