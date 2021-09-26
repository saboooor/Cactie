function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
module.exports = {
	name: 'ticket',
	description: 'Create a ticket.',
	aliases: ['new'],
	usage: '[Description]',
	guildOnly: true,
	options: [{
		type: 3,
		name: 'message',
		description: 'The message to send on the ticket',
	}],
	async execute(message, args, client, reaction) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
		let author = message.member.user;
		if (reaction) {
			if (message.author.id != client.user.id) return;
			author = args;
		}
		const srvconfig = client.settings.get(message.guild.id);
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		let parent = message.guild.channels.cache.get(srvconfig.ticketcategory);
		const role = message.guild.roles.cache.get(srvconfig.supportrole);
		const channel = message.guild.channels.cache.find(c => c.name.toLowerCase() == `ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-${author.username.toLowerCase().replace(' ', '-')}`);
		if (channel) {
			message.guild.channels.cache.get(channel.id).send({ content: `❗ **${author} Ticket already exists!**` });
			const msg = await message.reply({ content: `You've already created a ticket at ${channel}!` });
			await sleep(5000);
			await msg.delete();
			return;
		}
		if (!role) return message.reply({ content: `You need to set a role with ${srvconfig.prefix}settings supportrole <Role Id>!` });
		if (!parent) parent = { id: null };
		if (parent.type != 'GUILD_CATEGORY') parent = { id: null };
		const ticket = await message.guild.channels.create(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-${author.username.toLowerCase().replace(' ', '-')}`, {
			type: 'text',
			parent: parent.id,
			topic: `Ticket Opened by ${author.tag}`,
			permissionOverwrites: [
				{
					id: message.guild.id,
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
		if (message.commandName) message.reply({ content: `Ticket created at ${ticket}!`, ephemeral: true });
		else message.reply({ content: `Ticket created at ${ticket}!` });
		client.logger.info(`Ticket created at #${ticket.name}`);
		await sleep(1000);
		const Embed = new MessageEmbed()
			.setColor(3447003)
			.setTitle('Ticket Created')
			.setDescription(`Please explain your issue and we'll be with you shortly\nIf you have multiple issues, please use the ${srvconfig.prefix}subticket command\nIf you want to create a private voice chat, please use the ${srvconfig.prefix}voiceticket command`);
		if (args && args[0] && !reaction) Embed.addField('Description', args.join(' '));
		if (client.settings.get(message.guild.id).tickets == 'buttons') {
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
		else if (client.settings.get(message.guild.id).tickets == 'reactions') {
			Embed.setFooter(`To close this ticket do ${srvconfig.prefix}close, or react with 🔒`);
			const embed = await ticket.send({ content: `${author}`, embeds: [Embed] });
			await embed.react('🔒');
			await embed.react('📜');
			await embed.react('🔊');
		}
		if (srvconfig.ticketmention == 'true') {
			const ping = await ticket.send({ content: '@everyone' });
			await ping.delete();
		}
	},
};