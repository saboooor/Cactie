const { MessageEmbed } = require('discord.js');
const getTranscript = require('../functions/getTranscript.js');
module.exports = {
	name: 'delete_ticket',
	botperm: 'MANAGE_CHANNELS',
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${interaction.channel.id}'`))[0];
			if (!ticketData) return interaction.reply({ content: 'Could not find this ticket in the database, please manually delete this channel.' });
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket is still open
			if (interaction.channel.name.startsWith(`ticket${client.user.username.replace('Cactie ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket needs to be closed first!' });

			// Check if ticket log channel is set in settings
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			if (srvconfig.logchannel != 'false') {
				// Get transcript of ticket
				await interaction.reply({ content: 'Creating transcript...' });
				const messages = await interaction.channel.messages.fetch({ limit: 100 });
				const link = await getTranscript(messages);

				// Get list of users for embed
				const users = [];
				await ticketData.users.forEach(userid => users.push(client.users.cache.get(userid)));

				// Create embed
				const Embed = new MessageEmbed()
					.setColor(Math.floor(Math.random() * 16777215))
					.setTitle(`Deleted ${interaction.channel.name}`)
					.addField('**Users in ticket**', `${users}`)
					.addField('**Transcript**', `${link}.txt`)
					.addField('**Deleted by**', `${interaction.user}`);

				// Send embed to ticket log channel
				await interaction.guild.channels.cache.get(srvconfig.logchannel).send({ embeds: [Embed] });
				client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);
			}

			// Actually delete ticket and ticket database
			client.delData('ticketdata', 'channelId', interaction.channel.id);
			client.logger.info(`Deleted ticket #${interaction.channel.name}`);
			await interaction.channel.delete();
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};