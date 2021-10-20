function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
module.exports = {
	name: 'create_ticket',
	async execute(interaction, client) {
		// Check if tickets are disabled
		const srvconfig = client.settings.get(interaction.guild.id);
		if (srvconfig.tickets == 'false') return interaction.reply({ content: 'Tickets are disabled!' });

		// Find category and if no category then set it to null
		let parent = interaction.guild.channels.cache.get(srvconfig.ticketcategory);
		if (!parent) parent = { id: null };
		if (parent.type != 'GUILD_CATEGORY') parent = { id: null };

		// Find role and if no role then reply with error
		const role = interaction.guild.roles.cache.get(srvconfig.supportrole);
		if (!role) return interaction.reply({ content: `You need to set a role with ${srvconfig.prefix}settings supportrole <Role Id>!` });

		// Check if ticket already exists
		const author = interaction.user;
		const channel = interaction.guild.channels.cache.find(c => c.name.toLowerCase() == `ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-${author.username.toLowerCase().replace(' ', '-')}`);
		if (channel) {
			interaction.guild.channels.cache.get(channel.id).send({ content: `❗ **${author} Ticket already exists!**` });
			return interaction.reply({ content: `You've already created a ticket at ${channel}!`, ephemeral: true });
		}

		// Create ticket and set database
		const ticket = await interaction.guild.channels.create(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-${author.username.toLowerCase().replace(' ', '-')}`, {
			type: 'text',
			parent: parent.id,
			topic: `Ticket Opened by ${author.tag}`,
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: ['VIEW_CHANNEL', 'USE_PUBLIC_THREADS', 'USE_PRIVATE_THREADS'],
				},
				{
					id: client.user.id,
					allow: ['VIEW_CHANNEL', 'USE_PUBLIC_THREADS', 'USE_PRIVATE_THREADS'],
				},
				{
					id: author.id,
					allow: ['VIEW_CHANNEL'],
				},
				{
					id: role.id,
					allow: ['VIEW_CHANNEL'],
				},
			],
		}).catch(error => client.logger.error(error));
		client.tickets.set(ticket.id, author.id, 'opener');
		client.tickets.set(ticket.id, 'false', 'resolved');
		client.tickets.set(ticket.id, [], 'users');
		client.tickets.push(ticket.id, author.id, 'users');
		interaction.reply({ content: `Ticket created at ${ticket}!`, ephemeral: true });
		client.logger.info(`Ticket created at #${ticket.name}`);

		// Create embed
		await sleep(1000);
		const Embed = new MessageEmbed()
			.setColor(3447003)
			.setTitle('Ticket Created')
			.setDescription(`Please explain your issue and we'll be with you shortly\nIf you have multiple issues, please use the ${srvconfig.prefix}subticket command\nIf you want to create a private voice chat, please use the ${srvconfig.prefix}voiceticket command`);

		// Check if ticket mode is buttons or reactions and send embed
		if (srvconfig.tickets == 'buttons') {
			Embed.setFooter(`To close this ticket do ${srvconfig.prefix}close, or click the button below`);
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('close_ticket')
						.setLabel('Close Ticket')
						.setEmoji('🔒')
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('subticket_create')
						.setLabel('Create Subticket')
						.setEmoji('📜')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('voiceticket_create')
						.setLabel('Create Voiceticket')
						.setEmoji('🔊')
						.setStyle('SECONDARY'),
				);
			await ticket.send({ content: `${author}`, embeds: [Embed], components: [row] });
		}
		else if (srvconfig.tickets == 'reactions') {
			Embed.setFooter(`To close this ticket do ${srvconfig.prefix}close, or react with 🔒`);
			const embed = await ticket.send({ content: `${author}`, embeds: [Embed] });
			await embed.react('🔒');
			await embed.react('📜');
			await embed.react('🔊');
		}

		// Ping everyone if enabled
		if (srvconfig.ticketmention == 'true') {
			const ping = await ticket.send({ content: '@everyone' });
			await ping.delete();
		}
	},
};