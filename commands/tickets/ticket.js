function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonComponent, ButtonStyle, ActionRow, Embed, PermissionsBitField } = require('discord.js');
module.exports = {
	name: 'ticket',
	description: 'Create a ticket',
	ephemeral: true,
	aliases: ['new'],
	usage: '[Description]',
	options: require('../options/ticket.json'),
	botperm: 'ManageChannels',
	async execute(message, args, client, reaction) {
		try {
			let author = message.member.user;
			if (reaction) {
				if (message.author.id != client.user.id) return;
				author = args;
			}
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
			let parent = message.guild.channels.cache.get(srvconfig.ticketcategory);
			const role = message.guild.roles.cache.get(srvconfig.supportrole);
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE opener = '${author.id}'`))[0];
			if (ticketData) {
				const channel = message.guild.channels.cache.get(ticketData.channelId);
				channel.send({ content: `❗ **${author} Ticket already exists!**` });
				return message.reply({ content: `You've already created a ticket at ${channel}!` });
			}
			if (!role) return message.reply({ content: 'You need to set a role with /settings supportrole <Role Id>!' });
			if (!parent) parent = { id: null };
			if (!parent.isCategory()) parent = { id: null };
			const ticket = await message.guild.channels.create(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-${author.username.toLowerCase().replace(' ', '-')}`, {
				parent: parent.id,
				topic: `Ticket Opened by ${author.tag}`,
				permissionOverwrites: [
					{
						id: message.guild.id,
						deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.UsePublicThreads, PermissionsBitField.Flags.UsePrivateThreads],
					},
					{
						id: client.user.id,
						allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.UsePublicThreads, PermissionsBitField.Flags.UsePrivateThreads],
					},
					{
						id: author.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						id: role.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
				],
			}).catch(error => client.logger.error(error));
			await client.setData('ticketdata', 'channelId', ticket.id, 'opener', author.id);
			await client.setData('ticketdata', 'channelId', ticket.id, 'users', author.id);
			message.reply({ content: `Ticket created at ${ticket}!` });
			client.logger.info(`Ticket created at #${ticket.name}`);
			await sleep(1000);
			const CreateEmbed = new Embed()
				.setColor(0x5662f6)
				.setTitle('Ticket Created')
				.setDescription('Please explain your issue and we\'ll be with you shortly\nIf you have multiple issues, please use the /subticket command\nIf you want to create a private voice chat, please use the /voiceticket command\n\nMessages will be transcripted for future reference and are sent to the staff and people participating in the ticket.');
			if (args && args[0] && !reaction) CreateEmbed.addField({ name: 'Description', value: args.join(' ') });
			if (srvconfig.tickets == 'buttons') {
				CreateEmbed.setFooter({ text: 'To close this ticket do /close, or click the button below' });
				const row = new ActionRow()
					.addComponents(
						new ButtonComponent()
							.setCustomId('close_ticket')
							.setLabel('Close Ticket')
							.setEmoji({ name: '🔒' })
							.setStyle(ButtonStyle.Danger),
						new ButtonComponent()
							.setCustomId('subticket_create')
							.setLabel('Create Subticket')
							.setEmoji({ name: '📜' })
							.setStyle(ButtonStyle.Primary),
						new ButtonComponent()
							.setCustomId('voiceticket_create')
							.setLabel('Create Voiceticket')
							.setEmoji({ name: '🔊' })
							.setStyle(ButtonStyle.Secondary),
					);
				await ticket.send({ content: `${author}`, embeds: [CreateEmbed], components: [row] });
			}
			else if (srvconfig.tickets == 'reactions') {
				CreateEmbed.setFooter({ text: 'To close this ticket do /close, or react with 🔒' });
				const Panel = await ticket.send({ content: `${author}`, embeds: [CreateEmbed] });
				await Panel.react('🔒');
				await Panel.react('📜');
				await Panel.react('🔊');
			}
			// Ping with the ticketmention setting if enabled
			if (srvconfig.ticketmention != 'false') {
				let ping = null;
				if (srvconfig.ticketmention == 'here') ping = await ticket.send({ content: '@here' });
				else if (srvconfig.ticketmention == 'everyone') ping = await ticket.send({ content: '@everyone' });
				else ping = await ticket.send({ content: `<@${srvconfig.ticketmention}>` });
				await ping.delete();
			}
		}
		catch (err) {
			client.error(err, message);
		}
	},
};