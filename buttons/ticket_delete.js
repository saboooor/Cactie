const { MessageEmbed } = require('discord.js');
const getTranscript = require('../functions/getTranscript.js');
module.exports = {
	name: 'delete_ticket',
	async execute(interaction, client) {
		// Check if ticket is still open
		if (interaction.channel.name.startsWith(`ticket${client.user.username.replace('Pup ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket needs to be closed first!' });

		// Check if ticket log channel is set in settings
		const srvconfig = client.settings.get(interaction.guild.id);
		if (srvconfig.ticketlogchannel != 'false') {
			// Get transcript of ticket
			await interaction.reply({ content: 'Creating transcript...' });
			const messages = await interaction.channel.messages.fetch({ limit: 100 });
			const link = await getTranscript(messages);

			// Get list of users for embed
			const users = [];
			await client.tickets.get(interaction.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));

			// Create embed
			const Embed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Deleted ${interaction.channel.name}`)
				.addField('**Users in ticket**', `${users}`)
				.addField('**Transcript**', `${link}.txt`)
				.addField('**Deleted by**', `${interaction.user}`);

			// Send embed to ticket log channel
			await client.channels.cache.get(srvconfig.ticketlogchannel).send({ embeds: [Embed] });
			client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);
		}
		else { interaction.reply({ content: 'Deleting Ticket...' }); }

		// Actually delete ticket and ticket database
		await client.tickets.delete(interaction.channel.id);
		client.logger.info(`Deleted ticket #${interaction.channel.name}`);
		await interaction.channel.delete();
	},
};