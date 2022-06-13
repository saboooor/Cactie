function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
module.exports = {
	name: 'ticket',
	description: 'Create a ticket',
	ephemeral: true,
	aliases: ['new'],
	usage: '[Description]',
	botperm: 'ManageChannels',
	options: require('../../options/ticket.js'),
	async execute(message, args, client, lang, reaction) {
		try {
			// Set author to command sender
			let author = message.member.user;

			// If this command is being used as a reaction:
			// return if the message isn't a ticket panel
			// set author to args, which is the reaction user
			if (reaction) {
				if (message.author.id != client.user.id) return;
				author = args;
			}

			// Check if tickets are disabled
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.tickets == 'false') return client.error('Tickets are disabled!', message, true);

			// Check if ticket already exists
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE opener = '${author.id}' AND guildId = '${message.guild.id}'`))[0];
			if (ticketData) {
				const channel = message.guild.channels.cache.get(ticketData.channelId);
				channel.send({ content: `❗ **${author} Ticket already exists!**` });
				return client.error(`You've already created a ticket at #${channel.name}!`, message, true);
			}

			// Find category and if no category then set it to null
			const parent = message.guild.channels.cache.get(srvconfig.ticketcategory);

			// Create ticket and set database
			const ticket = await message.guild.channels.create({
				name: `ticket${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1].toLowerCase() : ''}-${author.username.toLowerCase().replace(' ', '-')}`,
				parent: parent ? parent.id : null,
				topic: `Ticket Opened by ${author.tag}`,
				permissionOverwrites: [
					{
						id: message.guild.id,
						deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessagesInThreads],
					},
					{
						id: client.user.id,
						allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessagesInThreads],
					},
					{
						id: author.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
				],
				reason: args.join(' '),
			});

			// Find role and set perms and if no role then send error
			const role = message.guild.roles.cache.get(srvconfig.supportrole);
			if (role) await message.channel.permissionOverwrites.edit(role.id, { ViewChannel: true });
			else ticket.send({ content: '❗ **No support role set!**\nOnly Administrators can see this ticket.\nTo set a support role, do `/settings supportrole`' });

			await client.query(`INSERT INTO ticketdata (guildId, channelId, opener, users) VALUES ('${message.guild.id}', '${ticket.id}', '${author.id}', '${author.id}');`);
			message.reply({ content: `Ticket created at ${ticket}!` });
			client.logger.info(`Ticket created at #${ticket.name}`);

			// Create embed
			await sleep(1000);
			const CreateEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setTitle('Ticket Created')
				.setDescription('Please explain your issue and we\'ll be with you shortly\nIf you have multiple issues, please use the /subticket command\nIf you want to create a private voice chat, please use the /voiceticket command\n\nMessages will be transcripted for future reference and are sent to the staff and people participating in the ticket.');
			if (args && args[0] && !reaction) CreateEmbed.addFields([{ name: 'Description', value: args.join(' ') }]);

			// Ping the staff if enabled
			let ping;
			if (srvconfig.ticketmention == 'here' || srvconfig.ticketmention == 'everyone') ping = `@${srvconfig.ticketmention}`;
			else if (srvconfig.ticketmention != 'false') ping = `<@${srvconfig.ticketmention}>`;

			// If tickets is set to buttons, add buttons, if not, add reactions
			if (srvconfig.tickets == 'buttons') {
				// Set the footer with the close reminder with button
				CreateEmbed.setFooter({ text: 'To close this ticket do /close, or click the button below' });

				// Create button row and send to ticket
				const row = new ActionRowBuilder()
					.addComponents([
						new ButtonBuilder()
							.setCustomId('close_ticket')
							.setLabel('Close Ticket')
							.setEmoji({ name: '🔒' })
							.setStyle(ButtonStyle.Danger),
						new ButtonBuilder()
							.setCustomId('subticket_create')
							.setLabel('Create Subticket')
							.setEmoji({ name: '📜' })
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setCustomId('voiceticket_create')
							.setLabel('Create Voiceticket')
							.setEmoji({ name: '🔊' })
							.setStyle(ButtonStyle.Secondary),
					]);
				await ticket.send({ content: `${author}${ping ? ping : ''}`, embeds: [CreateEmbed], components: [row] });
			}
			else if (srvconfig.tickets == 'reactions') {
				// Set the footer with the close reminder with reaction
				CreateEmbed.setFooter({ text: 'To close this ticket do /close, or react with 🔒' });

				// Send to ticket and react
				const Panel = await ticket.send({ content: `${author}${ping ? ping : ''}`, embeds: [CreateEmbed] });
				await Panel.react('🔒');
				await Panel.react('📜');
				await Panel.react('🔊');
			}
		}
		catch (err) { client.error(err, message); }
	},
};