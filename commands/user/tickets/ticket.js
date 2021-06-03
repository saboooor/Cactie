function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
function minTwoDigits(n) { return (n < 10 ? '0' : '') + n; }
const Discord = require('discord.js');
module.exports = {
	name: 'ticket',
	description: 'Create a ticket.',
	aliases: ['new'],
	guildOnly: true,
	options: [{
		type: 3,
		name: 'message',
		description: 'The message to send on the ticket',
	}],
	async execute(message, args, client, reaction) {
		if (message.commandName) args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		let author = message.member.user;
		if (reaction) {
			if (message.author.id != client.user.id) return;
			author = args;
		}
		const srvconfig = client.settings.get(message.guild.id);
		if (srvconfig.tickets == 'false') return message.reply('Tickets are disabled!');
		let parent = message.guild.channels.cache.get(srvconfig.ticketcategory);
		const role = message.guild.roles.cache.get(srvconfig.supportrole);
		const channel = message.guild.channels.cache.find(c => c.name.toLowerCase() == `ticket-${author.username.toLowerCase().replace(' ', '-')}`);
		if (channel) {
			message.guild.channels.cache.get(channel.id).send(`❗ **${author} Ticket already exists!**`);
			const msg = await message.reply(`You've already created a ticket at ${channel}!`);
			await sleep(5000);
			await msg.delete();
			return;
		}
		if (!role) return message.reply(`You need to set a role with ${srvconfig.prefix}settings supportrole <Role ID>!`);
		if (!parent) parent = { id: null };
		if (parent.type != 'category') parent = { id: null };
		const ticket = await message.guild.channels.create(`ticket-${author.username.toLowerCase().replace(' ', '-')}`, {
			type: 'text',
			parent: parent.id,
			topic: `Ticket Opened by ${author.tag}`,
			permissionOverwrites: [
				{
					id: message.guild.id,
					deny: ['VIEW_CHANNEL'],
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
		}).catch(console.error);
		client.tickets.set(ticket.id, author.id, 'opener');
		client.tickets.push(ticket.id, author.id, 'users');
		if (message.commandName) message.reply(`Ticket created at ${ticket}!`, { ephemeral: true });
		else message.reply(`Ticket created at ${ticket}!`);
		const rn = new Date();
		const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
		console.log(`[${time} INFO]: Ticket created at #${ticket.name}`);
		await sleep(1000);
		const Embed = new Discord.MessageEmbed()
			.setColor(3447003)
			.setTitle('Ticket Created')
			.setDescription('Please explain your issue and we\'ll be with you shortly.')
			.setFooter(`To close this ticket do ${srvconfig.prefix}close, /close or react with 🔒`);
		if (args && args[0] && !reaction) Embed.addField('Description', args.join(' '));
		const embed = await ticket.send(`${author}`, Embed);
		embed.react('🔒');
		if (srvconfig.ticketmention == 'true') {
			const ping = await ticket.send('@.everyone');
			await ping.delete();
		}
	},
};