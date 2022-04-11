const { EmbedBuilder } = require('discord.js');
const getTranscript = require('../functions/getTranscript.js');
module.exports = {
	name: 'delete_ticket',
	botperm: 'ManageChannels',
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${interaction.channel.id}'`))[0];
			if (!ticketData) return client.error('Could not find this ticket in the database, please manually delete this channel.', interaction, true);
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket log channel is set in settings
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			if (srvconfig.logchannel != 'false') {
				// Get transcript of ticket
				await interaction.reply({ content: 'Creating transcript...' });
				const messages = await interaction.channel.messages.fetch({ limit: 100 });
				const link = await getTranscript(messages);

				// Get list of users for embed
				const users = [];
				await ticketData.users.forEach(userid => {
					const ticketmember = interaction.Mathguild.members.cache.get(userid);
					if (ticketmember) users.push(ticketmember);
				});

				// Create embed
				const DelEmbed = new EmbedBuilder()
					.setColor(Math.floor(Math.random() * 16777215))
					.setTitle(`Deleted ${interaction.channel.name}`)
					.addFields({ name: '**Users in ticket**', value: `${users}` })
					.addFields({ name: '**Transcript**', value: `${link}.txt` })
					.addFields({ name: '**Deleted by**', value: `${interaction.user}` });

				// Send embed to ticket log channel
				await interaction.guild.channels.cache.get(srvconfig.logchannel).send({ embeds: [DelEmbed] });
				client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);
			}

			// Actually delete ticket and ticket database
			client.delData('ticketdata', 'channelId', interaction.channel.id);
			client.logger.info(`Deleted ticket #${interaction.channel.name}`);
			await interaction.channel.delete();
		}
		catch (err) { client.error(err, interaction); }
	},
};