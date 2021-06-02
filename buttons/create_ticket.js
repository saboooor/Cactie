function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
function minTwoDigits(n) { return (n < 10 ? '0' : '') + n; }
const Discord = require('discord.js');
module.exports = {
	name: 'create_ticket',
	async execute(interaction, client) {
		const author = interaction.user;
		const srvconfig = client.settings.get(interaction.guild.id);
		if (srvconfig.tickets == 'false') return interaction.reply('Tickets are disabled!');
		let parent = interaction.guild.channels.cache.get(srvconfig.ticketcategory);
		const role = interaction.guild.roles.cache.get(srvconfig.supportrole);
		const channel = interaction.guild.channels.cache.find(c => c.name.toLowerCase() == `ticket-${author.username.toLowerCase().replace(' ', '-')}`);
		if (channel) return interaction.guild.channels.cache.get(channel.id).send(`❗ **${author} Ticket already exists!**`);
		if (!role) return interaction.reply(`You need to set a role with ${srvconfig.prefix}settings supportrole <Role ID>!`);
		if (!parent) parent = { id: null };
		if (parent.type != 'category') parent = { id: null };
		const ticket = await interaction.guild.channels.create(`ticket-${author.username.toLowerCase().replace(' ', '-')}`, {
			type: 'text',
			parent: parent.id,
			topic: `Ticket Opened by ${author.tag}`,
			permissionOverwrites: [
				{
					id: interaction.guild.id,
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
		interaction.reply(`Ticket created at ${ticket}!`);
		const rn = new Date();
		const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
		console.log(`[${time} INFO]: Ticket created at #${ticket.name}`);
		await sleep(1000);
		const Embed = new Discord.MessageEmbed()
			.setColor(3447003)
			.setTitle('Ticket Created')
			.setDescription('Please explain your issue and we\'ll be with you shortly.')
			.setFooter(`To close this ticket do ${srvconfig.prefix}close, /close or react with 🔒`)
			.addField('Extra details', 'Created using a button');
		const embed = await ticket.send(`${author}`, Embed);
		embed.react('🔒');
	},
};