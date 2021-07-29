const Discord = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'delete_ticket',
	async execute(interaction, client) {
		const author = interaction.user;
		const srvconfig = client.settings.get(interaction.guild.id);
		if (srvconfig.tickets == 'false') return interaction.reply({ content: 'Tickets are disabled!' });
		if (!interaction.channel.topic) return interaction.reply({ content: 'This is not a valid ticket!' });
		if (!interaction.channel.topic.startsWith('Ticket Opened by')) return interaction.reply({ content: 'This is not a valid ticket!' });
		if (interaction.channel.name.startsWith(`ticket${client.user.username.replace('Pup ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket needs to be closed first!' });
		if (srvconfig.ticketlogchannel != 'false') {
			await interaction.reply({ content: 'Creating transcript...' });
			const messages = await interaction.channel.messages.fetch({ limit: 100 });
			const link = await getTranscript(messages);
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