const hastebin = require('hastebin');
const Discord = require('discord.js');
module.exports = {
	name: 'delete_ticket',
	async execute(interaction, client) {
		const author = interaction.user;
		const srvconfig = client.settings.get(interaction.guild.id);
		if (srvconfig.tickets == 'false') return interaction.reply({ content: 'Tickets are disabled!' });
		if (!interaction.channel.topic) return interaction.reply({ content: 'This is not a valid ticket!' });
		if (!interaction.channel.topic.includes('Ticket Opened by')) return interaction.reply({ content: 'This is not a valid ticket!' });
		if (interaction.channel.name.includes(`ticket${client.user.username.replace('Pup ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket needs to be closed first!' });
		if (srvconfig.ticketlogchannel != 'false') {
			await interaction.reply({ content: 'Creating transcript...' });
			const interactions = await interaction.channel.messages.fetch({ limit: 100 });
			const logs = [];
			await interactions.forEach(async msg => {
				const time = new Date(msg.createdTimestamp).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
				logs.push(`[${time}] ${msg.author.tag}\n${msg.content}`);
			});
			logs.reverse();
			const link = await hastebin.createPaste(logs.join('\n\n'), { server: 'https://bin.birdflop.com' });
			const users = [];
			await client.tickets.get(interaction.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
			const Embed = new Discord.MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Deleted ${interaction.channel.name}`)
				.addField('**Users in ticket**', `${users}`)
				.addField('**Transcript**', `${link}.txt`)
				.addField('**Deleted by**', `${author}`);
			await client.channels.cache.get(srvconfig.ticketlogchannel).send({ embeds: [Embed] });
			client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);
		}
		else { interaction.reply({ content: 'Deleting Ticket...' }); }
		await client.tickets.delete(interaction.channel.id);
		client.logger.info(`Deleted ticket #${interaction.channel.name}`);
		await interaction.channel.delete();
	},
};