const { ChannelType, PermissionsBitField } = require('discord.js');
module.exports = {
	name: 'voiceticket_create',
	botperm: 'ManageChannels',
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${interaction.channel.id}'`))[0];
			if (!ticketData) return client.error('Could not find this ticket in the database, please manually delete this channel.', interaction, true);

			// Check if ticket already has a voiceticket
			if (ticketData.voiceticket && ticketData.voiceticket !== 'false') return client.error('This ticket already has a voiceticket!', interaction, true);

			// Check if ticket is closed
			if (interaction.channel.name.startsWith('closed')) return client.error('This ticket is closed!', interaction, true);

			// Find category and if no category then set it to null
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			let parent = interaction.guild.channels.cache.get(srvconfig.ticketcategory);
			if (!parent) parent = { id: null };


			// Create voice channel for voiceticket
			const author = interaction.guild.members.cache.get(ticketData.opener).user;
			const voiceticket = await interaction.guild.channels.create(`Voiceticket${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1] : ''} ${author.username}`, {
				type: ChannelType.GuildVoice,
				parent: parent.id,
				permissionOverwrites: [
					{
						id: interaction.guild.id,
						deny: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						id: client.user.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						id: author.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
				],
			});

			// Find role and add their permissions to the channel
			const role = interaction.guild.roles.cache.get(srvconfig.supportrole);
			if (role) interaction.channel.permissionOverwrites.edit(role.id, { ViewChannel: true });

			// Add voiceticket to ticket database
			await client.setData('ticketdata', 'channelId', interaction.channel.id, 'voiceticket', voiceticket.id);

			// Reply with voiceticket open message
			interaction.reply({ content: `Voiceticket created at ${voiceticket}!` });
			client.logger.info(`Voiceticket created at #${voiceticket.name}`);
		}
		catch (err) { client.error(err, interaction); }
	},
};